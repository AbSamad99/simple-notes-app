import { NextFunction, Request, Response, Router } from "express";

// Enums
import {
  ErrorCodes,
  StatusCodes,
  SuccessCodes,
} from "../../../constants/application-codes";
import { StatusStrings } from "../../../constants/status-strings";

// Errors
import { GenericError } from "../../../errors/generic-error";

// Helpers and Services
import { sendResponse } from "../../../helpers/send-response";

// Models
import { PasswordReset } from "../../../models/password-reset";

const router = Router();

router.get(
  "/verifyResetPassword/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const passwordReset = await PasswordReset.getPasswordResetBySecretKey(
      req.params.id
    );
    if (passwordReset) {
      return sendResponse(res, {
        statusCode: StatusCodes.OK,
        status: StatusStrings.OK,
        messages: [SuccessCodes.S04_02],
      });
    }
    return next(
      new GenericError("Invalid reset password link.", StatusCodes.BadRequest, [
        ErrorCodes.E04_02,
      ])
    );
  }
);

export { router as verifyResetPasswordRouter };
