import { NextFunction, Request, Router, Response } from "express";

// Enums
import {
  ErrorCodes,
  StatusCodes,
  SuccessCodes,
} from "../../../constants/application-codes";
import { StatusStrings } from "../../../constants/status-strings";

// Middlewares
import { validateRequest } from "../../../middlewares/validate-request";

// Errors
import { GenericError } from "../../../errors/generic-error";

// Helpers and Services
import { getCommonValidationChain } from "../../../helpers/validation-helpers";
import { sendResponse } from "../../../helpers/send-response";

// Models
import { User } from "../../../models/user";
import { PasswordReset } from "../../../models/password-reset";

const router = Router();

const validations = [
  getCommonValidationChain("password", ErrorCodes.E01_03)
    .isLength({
      max: 20,
      min: 8,
    })
    .withMessage(ErrorCodes.E01_04)
    .bail()
    .custom(
      (value) =>
        /[A-Z]/.test(value) &&
        /[a-z]/.test(value) &&
        /\d/.test(value) &&
        /[@$!&]/.test(value)
    )
    .withMessage(ErrorCodes.E01_05),
];

router.put(
  "/resetPassword/:id",
  validations,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;
    const passwordReset = await PasswordReset.getPasswordResetBySecretKey(
      req.params.id
    );
    if (passwordReset) {
      const user = await User.findById(passwordReset.userId);
      if (user) {
        user.password = password;
        await user.save();
        await passwordReset.delete();
        return sendResponse(res, {
          statusCode: StatusCodes.OK,
          status: StatusStrings.OK,
          messages: [SuccessCodes.S04_03],
        });
      }
    }

    return next(
      new GenericError("Invalid reset password link.", StatusCodes.BadRequest, [
        ErrorCodes.E04_02,
      ])
    );
  }
);

export { router as resetPasswordRouter };
