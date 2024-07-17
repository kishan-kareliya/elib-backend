import express from "express";
import bookController from "../controllers/bookController";

const bookRouter = express.Router();

bookRouter.post("/",bookController.createBook);

export default bookRouter;