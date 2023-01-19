import { NextFunction, Request, Response, Router } from "express";

// Enums
import {
  ErrorCodes,
  StatusCodes,
  SuccessCodes,
} from "../../../constants/application-codes";
import { StatusStrings } from "../../../constants/status-strings";
import { UserStatus } from "../../../constants/user-status";

// Errors
import { GenericError } from "../../../errors/generic-error";

// Helpers and Services
import { sendResponse } from "../../../helpers/send-response";

// Models
import { EmailVerification } from "../../../models/email-verification";
import { User } from "../../../models/user";

const router = Router();

router.put(
  "/verifyEmail/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const emailVerification =
      await EmailVerification.getEmailVerificationBySecretKey(req.params.id);
    if (emailVerification) {
      if (emailVerification.completed) {
        return next(
          new GenericError(
            "This email has already been verified.",
            StatusCodes.BadRequest,
            [ErrorCodes.E01_10]
          )
        );
      }
      const user = await User.findOne({
        emailVerification: emailVerification,
      }).populate("emailVerification");
      if (user) {
        user.status = UserStatus.AccessGranted;
        await user.save();
        emailVerification.completed = true;
        await emailVerification.save();

        return sendResponse(res, {
          statusCode: StatusCodes.OK,
          status: StatusStrings.OK,
          messages: [SuccessCodes.S01_07],
        });
      }
    }
    return next(
      new GenericError("Invalid verify email link.", StatusCodes.BadRequest, [
        ErrorCodes.E01_10,
      ])
    );
  }
);

export { router as verifyEmailRouter };
