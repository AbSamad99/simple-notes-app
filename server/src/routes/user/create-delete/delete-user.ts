import { NextFunction, Request, Response, Router } from "express";
import {
  ErrorCodes,
  StatusCodes,
  SuccessCodes,
} from "../../../constants/application-codes";
import { StatusStrings } from "../../../constants/status-strings";
import { sendResponse } from "../../../helpers/send-response";
import { adminAuth, requireAuth } from "../../../middlewares/auth-middlewares";
import {
  checkIfUserExists,
  checkIfUserIsAdmin,
  findUser,
} from "../../../middlewares/user-middlewares";

const router = Router();

router.delete(
  "/delete/:id",
  requireAuth,
  adminAuth,
  findUser,
  checkIfUserExists,
  checkIfUserIsAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.desiredUser!;
    await user.delete();
    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: StatusStrings.OK,
      messages: [SuccessCodes.S01_12],
    });
  }
);

export { router as deleteUserRouter };
