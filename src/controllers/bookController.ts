import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log("files", req.files);

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

    console.log(uploadResult);
    console.log(uploadPdfResult);

    res.send({});
  } catch (error) {
    console.log(error);

    return next(createHttpError(500, "Error while upload files."));
  }
};

export default {
  createBook,
};
