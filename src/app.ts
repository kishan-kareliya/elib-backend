import express from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./routes/userRouter";
import bookRouter from "./routes/bookRouter";
import { config } from "./config/config";

const app = express();
app.use(
  cors({
    origin: config.frontendDomain,
  })
);
app.use(express.json());

app.get("/", (req, res, next) => {
  res.json({
    message: "Welcome to elib api",
  });
});

app.use("/api/users", userRouter);
app.use("/api/books/", bookRouter);

app.use(globalErrorHandler);

export default app;
