import { Model, model, models } from "mongoose";
import UserSchema from "./User";
import GroupSchema from "./Group";
import { ExpenseDocument, GroupDocument, UserDocument } from "@/typings/models";
import ExpenseSchema from "./Expense";


const User: Model<UserDocument> = models.User as Model<UserDocument> || model<UserDocument>("User", UserSchema);
const Group: Model<GroupDocument> = models.Group as Model<GroupDocument> || model<GroupDocument>("Group", GroupSchema);
const Expense: Model<ExpenseDocument> = models.Expense as Model<ExpenseDocument> || model<ExpenseDocument>("Expense", ExpenseSchema);

export {
    User,
    Group,
    Expense
}