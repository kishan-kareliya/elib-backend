import express from "express";
import bookController from "../controllers/bookController";
import multer from "multer";
import path from "node:path";
import authentication from "../middlewares/authenticate";

const bookRouter = express.Router();

//multer store files local file system
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 1e7 }, // Accept max 10mb size
});

bookRouter.post(
  "/",
  authentication,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  bookController.createBook
);

bookRouter.patch(
  "/:bookId",
  authentication,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  bookController.updateBook
);

bookRouter.get("/", bookController.getAllBook);

bookRouter.get("/:bookId", bookController.getSingleBook);

bookRouter.delete("/:bookId", authentication, bookController.deleteBook);

export default bookRouter;
