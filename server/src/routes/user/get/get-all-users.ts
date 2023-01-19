import { NextFunction, Request, Response, Router } from "express";
import {
  StatusCodes,
  SuccessCodes,
} from "../../../constants/application-codes";
import { StatusStrings } from "../../../constants/status-strings";
import { sendResponse } from "../../../helpers/send-response";
import { adminAuth, requireAuth } from "../../../middlewares/auth-middlewares";
import { User } from "../../../models/user";

const router = Router();

router.get(
  "/",
  requireAuth,
  adminAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find({});

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: StatusStrings.OK,
      messages: [SuccessCodes.S01_04],
      data: users.filter((u) => !u.isAdmin),
    });
  }
);

export { router as getAllUsersRouter };
