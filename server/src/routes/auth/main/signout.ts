import { NextFunction, Request, Response, Router } from "express";
import {
  StatusCodes,
  SuccessCodes,
} from "../../../constants/application-codes";
import { StatusStrings } from "../../../constants/status-strings";
import { sendResponse } from "../../../helpers/send-response";

const router = Router();

router.get("/signout", (req: Request, res: Response, next: NextFunction) => {
  res.cookie("jwt", "none", {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "development",
  });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: StatusStrings.OK,
    messages: [SuccessCodes.S01_08],
  });
});

export { router as signoutRouter };
