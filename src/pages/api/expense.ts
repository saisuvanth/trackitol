import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import dbConnect from "@/lib/dbConnect";
import { Expense, User } from "@/models";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    await dbConnect();
    const user = await User.findById(session.user?.id);
    if (!user) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    if (req.method === 'GET') {
        const own_expenses = await Expense.find({ paidBy: user._id }).populate('paidBy').populate('participants.user');

        const expenses = await Expense.find({ participants: { $elemMatch: { user: user._id } } }).populate('paidBy').populate('participants.user');


        return res.status(200).json({ message: "expenses fetched", own_expenses, expenses });
    }

    else if (req.method === 'POST') {
        const { amount, comments, friendsAmount } = req.body;

        const totalShare = friendsAmount.reduce((acc: any, friend: any) => acc + parseFloat(friend.share), 0);
        if (totalShare !== parseFloat(amount)) {
            return res.status(400).json({ message: "total share should be equal to amount" })
        }

        const expense = new Expense({
            amount: parseFloat(amount), comments, paidBy: user._id, participants: friendsAmount.map((friend: any) => ({
                user: friend.userId,
                share: parseFloat(friend.share),
                settled: false
            }))
        });

        try {
            const newExpense = await expense.save();
            return res.status(200).json({ message: "expense created", expense: newExpense })
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({ message: e.message })
        }
    }
}