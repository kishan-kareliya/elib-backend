import { NextFunction, Request,Response } from "express";
import userModel from "../models/userModel";
import createHttpError from "http-errors";

const createUser = async (req: Request,res: Response,next: NextFunction) => {
    //check if email exist in db or not
    const user = await userModel.findOne({email: req.body.email});
    if(user){
        const error = createHttpError(409,"User Already Exist with this Email");
        return next(error);
    }

    res.send("Register request get successfully");
}

export default {
    createUser
}