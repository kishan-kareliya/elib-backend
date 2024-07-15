import express, { NextFunction, Request, Response } from 'express'
import globalErrorHandler from './middlewares/globalErrorHandler';
import userRouter from './routes/userRouter';
import userValidation from './middlewares/userValidation';

const app = express();
app.use(express.json());

app.get('/',(req,res,next) => {

    res.json({
        message: "Welcome to elib api"
    })
})

app.use("/api/users",userValidation,userRouter);

app.use(globalErrorHandler);

export default app;