import express from "express";
import userController from "../controllers/userController";
import userValidation from "../middlewares/userValidation";

const userRouter = express.Router();

userRouter.post('/register',userValidation.userRegistrationValidation,userController.registerUser);
userRouter.post('/login',userValidation.userLoginValidation,userController.loginUser);

export default userRouter;