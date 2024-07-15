import mongoose from "mongoose";
import Iuser from "../types/userTypes";

const userSchema = new mongoose.Schema<Iuser>({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
},  {timestamps: true})

const userModel = mongoose.model<Iuser>('User', userSchema);

export default userModel;