import { Request,Response,NextFunction } from "express";
import createHttpError from "http-errors";
import {z} from "zod";

const userValidationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})

const userValidation = (req: Request, res:Response, next:NextFunction) => {
    const result = userValidationSchema.safeParse(req.body);
    if (!result.success) {
        const error = createHttpError(400, "validation error")
        return next(error);
    }
    next();
}

export default userValidation;