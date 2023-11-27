import { ExpenseDocument } from "@/typings/models";
import { Schema } from "mongoose";

const ExpenseSchema = new Schema<ExpenseDocument>({
    amount: {
        type: Number,
        required: true
    },
    comments: {
        type: String,
        required: false
    },
    settled: {
        type: Boolean,
        required: true,
        default: false
    },
    paidBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        share: {
            type: Number,
            required: true
        },
        settled: {
            type: Boolean,
            required: true,
            default: false
        }
    }]
});


export default ExpenseSchema;