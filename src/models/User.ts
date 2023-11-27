import { UserDocument } from "@/typings/models";
import { genSalt, hash } from "bcryptjs";
import { Schema, Types } from "mongoose";


const UserSchema = new Schema<UserDocument>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false,
        select: false,
    },
    image: {
        type: String,
        required: false,
    },
    friends: [{
        type: Types.ObjectId,
        ref: 'User'
    }]
}).pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    if (this.password) {
        this.password = await hash(this.password, await genSalt(10));
    }
    next();
})

export default UserSchema;