import { NextFunction, Request, Response, Router } from "express";
import {
  ErrorCodes,
  StatusCodes,
  SuccessCodes,
} from "../../../constants/application-codes";
import { StatusStrings } from "../../../constants/status-strings";
import { UserStatus } from "../../../constants/user-status";
import { sendResponse } from "../../../helpers/send-response";
import { getCommonValidationChainNonString } from "../../../helpers/validation-helpers";
import { adminAuth, requireAuth } from "../../../middlewares/auth-middlewares";
import {
  checkIfUserExists,
  checkIfUserIsAdmin,
  findUser,
} from "../../../middlewares/user-middlewares";
import { validateRequest } from "../../../middlewares/validate-request";

const router = Router();

const validations = [
  getCommonValidationChainNonString("status", ErrorCodes.E01_15)
    .custom((status: number) => {
      return status in UserStatus;
    })
    .withMessage(ErrorCodes.E01_16),
];

router.put(
  "/updateStatus/:id",
  requireAuth,
  adminAuth,
  validations,
  validateRequest,
  findUser,
  checkIfUserExists,
  checkIfUserIsAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.body;

    const user = req.desiredUser!;

    user.set({
      status: status,
    });
    await user.save();

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: StatusStrings.OK,
      messages: [SuccessCodes.S01_13],
    });
  }
);

export { router as updateUserStatusRouter };
