import dbConnect from "@/lib/dbConnect";
import { User } from "@/models";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

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
        const { friends } = await user.populate('friends');
        return res.status(200).json({ message: "friends fetched", friends });
    }


    else if (req.method === 'POST') {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "friend_email is required" });
        }
        try {
            const friend = await User.findOneAndUpdate({ email: email }, {
                $push: { friends: user._id }
            }, { new: true });
            if (!friend || friend._id === user._id) {
                return res.status(404).json({ message: "friend not found" });
            }
            const updatedUser = await User.findByIdAndUpdate(user._id, {
                $push: {
                    friends: friend._id
                }
            }, { new: true });
            return res.status(200).json({ message: "friend added", user: friend });
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({ message: e.message });
        }
    }
}