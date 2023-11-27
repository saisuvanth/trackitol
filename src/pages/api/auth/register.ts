import dbConnect from "@/lib/dbConnect";
import { User } from "@/models";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req;
    if (method === "POST") {
        const { email, name, password } = req.body;
        if (!email || !name || !password) {
            res.status(400).json({ message: "Missing fields" });
        }
        try {

            dbConnect();

            const user = new User({ email, name, password });
            await user.save();

            res.status(200).json({ name });
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }
}