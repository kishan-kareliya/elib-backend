import express from "express";
import bookController from "../controllers/bookController";
import multer from "multer";
import path from "node:path";

const bookRouter = express.Router();

//multer store files local file system
const upload = multer({
    dest: path.resolve(__dirname, '../../public/data/uploads'),
    limits: {fileSize: 3e7} //30mb
})

bookRouter.post(
    "/",
    upload.fields([
    {name: "coverImage", maxCount: 1},
    {name: "file", maxCount: 1},
    ]),
    bookController.createBook
);

export default bookRouter;