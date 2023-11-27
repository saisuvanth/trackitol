import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import dbConnect from "@/lib/dbConnect";
import { Group, User } from "@/models";
import { Role } from "@/typings/models";

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
        const groups = await Group.find({ members: { $elemMatch: { user: user._id } } });

        return res.status(200).json({ message: "groups fetched", groups });
    }

    else if (req.method === 'POST') {
        const { name, description, memberIds } = req.body;

        const members = await User.find({ _id: { $in: memberIds } });
        if (members.length !== memberIds.length) {
            return res.status(404).json({ message: "member not found" });
        }

        const memberIdsWithRole = members.map(member => ({ user: member._id, role: Role.MEMBER }));
        memberIdsWithRole.push({ user: user._id, role: Role.ADMIN });
        const group = new Group({
            name, description, members: memberIdsWithRole
        })
        try {
            const newGroup = await group.save();
            return res.status(200).json({ message: "group created", group: newGroup });
        } catch (e: any) {
            console.error(e)
            return res.status(500).json({ message: e.message });
        }
    }
}