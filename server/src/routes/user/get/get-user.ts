import { NextFunction, Request, Response, Router } from "express";
import {
  StatusCodes,
  SuccessCodes,
} from "../../../constants/application-codes";
import { StatusStrings } from "../../../constants/status-strings";
import { sendResponse } from "../../../helpers/send-response";
import { adminAuth, requireAuth } from "../../../middlewares/auth-middlewares";
import {
  checkIfUserExists,
  findUser,
} from "../../../middlewares/user-middlewares";

const router = Router();

router.get(
  "/:id",
  requireAuth,
  adminAuth,
  findUser,
  checkIfUserExists,
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.desiredUser!;

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: StatusStrings.OK,
      messages: [SuccessCodes.S01_05],
      data: user,
    });
  }
);

export { router as getUserRouter };
