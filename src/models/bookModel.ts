import mongoose from "mongoose";
import Ibook from "../types/bookTypes";

const bookSchema = new mongoose.Schema<Ibook>({
    title: {
        type: String,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    }, 
    genre: {
        type: String,
        required: true
    }
},{timestamps: true})

const bookModel = mongoose.model<Ibook>("Book",bookSchema);

export default bookModel;