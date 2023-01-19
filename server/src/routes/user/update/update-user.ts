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
import {
  getCommonValidationChain,
  getCommonValidationChainOptional,
} from "../../../helpers/validation-helpers";
import { requireAuth } from "../../../middlewares/auth-middlewares";
import {
  checkIfUserExists,
  checkIfUserIsAdmin,
  findUser,
} from "../../../middlewares/user-middlewares";
import { validateRequest } from "../../../middlewares/validate-request";
import { User } from "../../../models/user";

const router = Router();

const validations = [
  getCommonValidationChain("firstName", ErrorCodes.E01_06),
  getCommonValidationChain("lastName", ErrorCodes.E01_07),
  getCommonValidationChain("email", ErrorCodes.E01_01)
    .isEmail()
    .normalizeEmail()
    .withMessage(ErrorCodes.E01_02),
  getCommonValidationChainOptional("password", ErrorCodes.E01_03)
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
  "/update/:id",
  requireAuth,
  validations,
  validateRequest,
  findUser,
  checkIfUserExists,
  checkIfUserIsAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password } = req.body;

    const user = req.desiredUser!;

    if (user.email !== email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(
          new GenericError("Email already in use", StatusCodes.BadRequest, [
            ErrorCodes.E01_08,
          ])
        );
      }
    }

    if (req.currentUser!.id == user.id) {
      if (!password || !PasswordHelper.compare(user.password, password)) {
        return next(
          new GenericError(
            "Invalid password provided.",
            StatusCodes.BadRequest,
            [ErrorCodes.E01_14]
          )
        );
      }
      user.set({
        firstName,
        lastName,
        email,
      });
      await user.save();
    } else if (req.currentUser!.isAdmin) {
      user.set({
        firstName,
        lastName,
        email,
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
      messages: [SuccessCodes.S01_10],
      data: user,
    });
  }
);

export { router as updateUserRouter };
