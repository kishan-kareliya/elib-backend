import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "../models/bookModel";
import fs from "node:fs";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;

  //files types that access from multer
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  ("application/pdf");

  try {
    //MimeType look like this application/jpg so we need jpg
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const fileName = files.coverImage[0].filename;
    //get a file path that upload by multer locally
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      fileName
    );

    //upload coverImage from localpath to cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    //get pdf file name
    const bookPdfFileName = files.file[0].filename;
    //get pdf mime type that looks application/pdf
    const bookPdfMimeType = files.file[0].mimetype.split("/").at(-1);
    //get pdf file path that stored by multer
    const bookPdfPath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookPdfFileName
    );

    //upload pdf to cloudinary for pdf we need to define resource_type = "raw"
    const uploadPdfResult = await cloudinary.uploader.upload(bookPdfPath, {
      resource_type: "raw",
      filename_override: bookPdfFileName,
      folder: "book-pdfs",
      format: bookPdfMimeType,
    });

    //@ts-ignore
    console.log("userId", req.userId);

    const newBook = await bookModel.create({
      title,
      genre,
      author: "66951c10bad99341075da1a7",
      coverImage: uploadResult.secure_url,
      file: uploadPdfResult.secure_url,
    });

    if (!newBook) {
      return next(createHttpError(500, "Error while create new book"));
    }

    //delete coverImage and pdf temporary file
    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookPdfPath);

    res.status(201).json({
      _id: newBook._id,
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while upload files."));
  }
};

export default {
  createBook,
};
