import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import createHttpError from "http-errors";

export interface AuthRequest extends Request {
  userId: string;
}

const authentication = (req: Request, res: Response, next: NextFunction) => {
  const intialToken = req.headers.authorization;

  if (!intialToken) {
    return next(createHttpError(401, "Authorization token is required"));
  }

  try {
    // split token with {Bearer actualToken}
    const parsedToken = intialToken?.split(" ")[1];

    const decoded = jwt.verify(parsedToken, config.jwtSecret as string);

    //typecast authrequest
    const _req = req as AuthRequest;
    _req.userId = decoded.sub as string;

    next();
  } catch (error) {
    return next(createHttpError(401, "Token Expired"));
  }
};

export default authentication;
