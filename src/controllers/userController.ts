import { NextFunction, Request,Response } from "express";
import userModel from "../models/userModel";
import createHttpError from "http-errors";
import bcrypt from 'bcrypt';
import Jwt  from "jsonwebtoken";
import { config } from "../config/config";

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

    //create new user in db
    const newUser = await userModel.create({
        name: name,
        email: email,
        password: hashedPassword
    }) 

    //token generation
    const token = Jwt.sign({sub: newUser._id}, config.jwtSecret as string,{expiresIn: "7d"}); 

    res.json({ accessToken: token });
}

export default {
    createUser
}