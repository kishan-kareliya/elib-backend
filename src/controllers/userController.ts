import { NextFunction, Request,Response } from "express";
import userModel from "../models/userModel";
import createHttpError from "http-errors";
import bcrypt from 'bcrypt';

const createUser = async (req: Request,res: Response,next: NextFunction) => {
    const {name,email,password} = req.body;

    //check if email exist in db or not
    const user = await userModel.findOne({email: email});
    if(user){
        const error = createHttpError(409,"User Already Exist with this Email");
        return next(error);
    }

    //hash user password
    const hashedPassword = await bcrypt.hash(password,10);

    const newUser = await userModel.create({
        name: name,
        email: email,
        password: hashedPassword
    }) 

    res.json({
        id: newUser._id
    });
}

export default {
    createUser
}