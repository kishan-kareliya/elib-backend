import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./routes/userRouter";
import bookRouter from "./routes/bookRouter";

const app = express();
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
