import { GroupDocument, IGroupMember, Role } from "@/typings/models";
import { Schema } from "mongoose";
import ExpenseSchema from "./Expense";

const GroupMemberSchema = new Schema<IGroupMember>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: Object.values(Role),
        default: Role.MEMBER
    }
})

const GroupSchema = new Schema<GroupDocument>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    members: [GroupMemberSchema],
    expenses: [ExpenseSchema]
});


export default GroupSchema;