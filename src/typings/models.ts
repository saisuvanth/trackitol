import { Types } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password?: string;
    image?: string;
    friends: Types.ObjectId[];
}

export interface UserDocument extends Document, IUser { };

export enum Role {
    ADMIN = 'admin',
    MEMBER = 'member'
}

export interface IGroupMember {
    user: Types.ObjectId;
    role: Role
}

export interface IGroup {
    name: string;
    description?: string;
    members: IGroupMember[];
    expenses: Types.ObjectId[];
}


export interface GroupDocument extends Document, IGroup { }


export interface IExpenseParticipant {
    user: Types.ObjectId;
    share: number;
    settled: boolean;
}

export interface IExpense {
    amount: number;
    comments: string;
    settled: boolean;
    paidBy: Types.ObjectId;
    participants: IExpenseParticipant[];
}

export interface ExpenseDocument extends Document, IExpense { }