import { NextFunction, Request,Response } from "express";
import createHttpError from "http-errors";

const createUser = async (req: Request,res: Response,next: NextFunction) => {
    res.send("Register request get successfully");
}

export default {
    createUser
}