import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "../models/bookModel";
import fs from "node:fs";
import { AuthRequest } from "../middlewares/authenticate";

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

    const _req = req as AuthRequest;

    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
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

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;

  // check book in the db has or not
  const book = await bookModel.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError(404, "Book not found!"));
  }

  // if user try to update book someone else then unauthorized request
  const _req = req as AuthRequest;
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, "Unauthorized"));
  }

  // check image in the fields exist or not
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  let completeCoverImage = "";
  if (files.coverImage) {
    const fileName = files.coverImage[0].filename;
    //MimeType look like this application/jpg so we need jpg
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

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

    //store cloudinary url of coverImage
    completeCoverImage = uploadResult.secure_url;

    //remove coverImage locally
    await fs.promises.unlink(filePath);
  }

  let completePdfFile = "";

  if (files.file) {
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

    // get pdf file cloudinary stored url
    completePdfFile = uploadPdfResult.secure_url;

    //remove pdf locally
    await fs.promises.unlink(bookPdfPath);
  }

  //update book in the db

  const updatedBook = await bookModel.findOneAndUpdate(
    { _id: bookId },
    {
      title: title,
      genre: genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completePdfFile ? completePdfFile : book.file,
    },
    { new: true }
  );

  res.json(updatedBook);
};

const getBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await bookModel.find({});

    if (!books) {
      return next(createHttpError(402, "Error while finding book"));
    }

    res.status(200).json(books);
  } catch (error) {
    return next(createHttpError(500, "Error while getting book"));
  }
};

export default {
  createBook,
  updateBook,
  getBook,
};
