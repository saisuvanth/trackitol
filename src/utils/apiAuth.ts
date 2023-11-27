import dbConnect from "@/lib/dbConnect";
import { User } from "@/models";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

const apiAuth = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    await dbConnect();
    const user = await User.findById(session.user?.id);
    if (!user) {
        return res.status(403).json({ message: "Unauthorized" });
    }
    return user;
}

export default apiAuth;