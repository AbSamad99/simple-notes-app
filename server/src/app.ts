import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Enums
import { ErrorCodes, StatusCodes } from "./constants/application-codes";

// Middlewares
import { errorHandler } from "./middlewares/error-handler";
import { getCurrentUser } from "./middlewares/auth-middlewares";

// Errors
import { GenericError } from "./errors/generic-error";

// Routers
import { userRouter } from "./routes/user/user";
import { authRouter } from "./routes/auth/auth";
import { noteRouter } from "./routes/notes/note";

// Configuring application
dotenv.config();
const app = express();

// Using middlewares
app.use(express.json());
app.use(cookieParser());
app.use(getCurrentUser);
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// Using routers
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/note", noteRouter);
app.all("/*", (req: Request, res: Response, next: NextFunction) => {
  return next(
    new GenericError("Resource not Found.", StatusCodes.NotFound, [
      ErrorCodes.E00_02,
    ])
  );
});
app.use(errorHandler);

export { app };
