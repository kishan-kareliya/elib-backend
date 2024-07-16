import { NextFunction, Request,Response } from "express";
import userModel from "../models/userModel";
import createHttpError from "http-errors";
import bcrypt from 'bcrypt';
import Jwt  from "jsonwebtoken";
import { config } from "../config/config";
import Iuser from "../types/userTypes";

const createUser = async (req: Request,res: Response,next: NextFunction) => {
    const {name,email,password} = req.body;

    try{
        //check if email exist in db or not
        const user = await userModel.findOne({email: email});
        if(user){
            const error = createHttpError(409,"User Already Exist with this Email");
            return next(error);
        }
    }catch(error){
        return next(createHttpError(500,"Error while getting user"));
    }
    
    //hash user password
    const hashedPassword = await bcrypt.hash(password,10);
    
    let newUser:Iuser;

    try{
        //create new user in db
        newUser = await userModel.create({
            name: name,
            email: email,
            password: hashedPassword
        }) 
    }
    catch(error){
        return next(createHttpError(500,"Error while creating user"));
    }

    //token generation
    const token = Jwt.sign({sub: newUser._id}, config.jwtSecret as string,{expiresIn: "7d"}); 
    res.json({ accessToken: token });
}

export default {
    createUser
}