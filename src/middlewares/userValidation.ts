import { Request,Response,NextFunction } from "express";
import createHttpError from "http-errors";
import {z} from "zod";

const userRegistrationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})

const userRegistrationValidation = (req: Request, res:Response, next:NextFunction) => {
    const result = userRegistrationSchema.safeParse(req.body);
    if (!result.success) {
        const error = createHttpError(400, "validation error")
        return next(error);
    }
    next();
}

const userLoginValidationSchema = z.object({
    email: z.string().email("Invalid Email Address"),
    password: z.string().min(6,"Password must be at least 6 characters long"),
})

const userLoginValidation = (req:Request, res: Response, next: NextFunction) => {
    const result = userLoginValidationSchema.safeParse(req.body);
    if(!result.success){
        const error = createHttpError(400, "Valildation Error");
        return next(error);
    }
    next();
}

export default {
    userRegistrationValidation,
    userLoginValidation
};