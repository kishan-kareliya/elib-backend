import { HttpError } from "http-errors";
import { Request, Response, NextFunction } from "express";
import { config } from "../config/config";

const globalErrorHandler = (
    err: HttpError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.status || 500;

    res.status(statusCode).json({
        status: "error",
        message: err.message,
        errorStack: config.env === "development" ? err.stack : ""
    });
}

export default globalErrorHandler;
