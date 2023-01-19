import { NextFunction, Request, Response, Router } from "express";
import {
  ErrorCodes,
  StatusCodes,
  SuccessCodes,
} from "../../../constants/application-codes";
import { StatusStrings } from "../../../constants/status-strings";
import { GenericError } from "../../../errors/generic-error";
import { PasswordHelper } from "../../../helpers/password-helper";
import { sendResponse } from "../../../helpers/send-response";
import { getCommonValidationChain } from "../../../helpers/validation-helpers";
import { requireAuth } from "../../../middlewares/auth-middlewares";
import {
  checkIfUserExists,
  checkIfUserIsAdmin,
  findUser,
} from "../../../middlewares/user-middlewares";
import { validateRequest } from "../../../middlewares/validate-request";

const router = Router();

const validations = [
  getCommonValidationChain("currentPassword", ErrorCodes.E01_03),
  getCommonValidationChain("newPassword", ErrorCodes.E01_03)
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
  "/updatePassword/:id",
  requireAuth,
  validations,
  validateRequest,
  findUser,
  checkIfUserExists,
  checkIfUserIsAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;

    const user = req.desiredUser!;

    if (req.currentUser!.id == user.id) {
      if (
        !currentPassword ||
        !PasswordHelper.compare(user.password, currentPassword)
      ) {
        return next(
          new GenericError(
            "Invalid password provided.",
            StatusCodes.BadRequest,
            [ErrorCodes.E01_14]
          )
        );
      }
      user.set({
        password: newPassword,
      });
      await user.save();
    } else if (req.currentUser!.isAdmin) {
      user.set({
        password: newPassword,
      });
      await user.save();
    } else {
      return next(
        new GenericError("Not Authorised", StatusCodes.Unauthorised, [
          ErrorCodes.E00_03,
        ])
      );
    }

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: StatusStrings.OK,
      messages: [SuccessCodes.S01_11],
      data: user,
    });
  }
);

export { router as updateUserPasswordRouter };
