import { NextFunction, Request, Response, Router } from "express";
import {
  ErrorCodes,
  StatusCodes,
  SuccessCodes,
} from "../../../constants/application-codes";
import { StatusStrings } from "../../../constants/status-strings";
import { UserStatus } from "../../../constants/user-status";
import { GenericError } from "../../../errors/generic-error";
import { sendResponse } from "../../../helpers/send-response";
import { getCommonValidationChain } from "../../../helpers/validation-helpers";
import { adminAuth, requireAuth } from "../../../middlewares/auth-middlewares";
import { validateRequest } from "../../../middlewares/validate-request";
import { EmailVerification } from "../../../models/email-verification";
import { User } from "../../../models/user";

const router = Router();

const validations = [
  getCommonValidationChain("firstName", ErrorCodes.E01_06),
  getCommonValidationChain("lastName", ErrorCodes.E01_07),
  getCommonValidationChain("email", ErrorCodes.E01_01)
    .isEmail()
    .normalizeEmail()
    .withMessage(ErrorCodes.E01_02),
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

router.post(
  "/create",
  requireAuth,
  adminAuth,
  validations,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password, isAdmin } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        new GenericError("Email already in use", StatusCodes.BadRequest, [
          ErrorCodes.E01_08,
        ])
      );
    }

    const newUser = User.build({
      firstName,
      lastName,
      email,
      password,
      isAdmin: isAdmin ? true : false,
      status: UserStatus.AccessGranted,
    });
    await newUser.save();

    return sendResponse(res, {
      statusCode: StatusCodes.Created,
      status: StatusStrings.OK,
      messages: [SuccessCodes.S01_09],
      data: newUser,
    });
  }
);

export { router as createUserRouter };
