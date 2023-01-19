import { Router, Request, Response, NextFunction } from "express";

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
import { PasswordHelper } from "../../../helpers/password-helper";
import { getJwtToken } from "../../../helpers/jwt-helpers";

// Models
import { User } from "../../../models/user";
import { UserStatus } from "../../../constants/user-status";

const router = Router();

const validations = [
  getCommonValidationChain("email", ErrorCodes.E01_01)
    .isEmail()
    .normalizeEmail()
    .withMessage(ErrorCodes.E01_02),
  getCommonValidationChain("password", ErrorCodes.E01_03),
];

router.post(
  "/signin",
  validations,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("emailVerification");
    if (!user || !PasswordHelper.compare(user.password, password)) {
      return next(
        new GenericError(
          "Invalid credentials provided.",
          StatusCodes.BadRequest,
          [ErrorCodes.E01_13]
        )
      );
    }
    if (
      user.status === UserStatus.VerificationPending ||
      (user.emailVerification && !user.emailVerification.completed)
    ) {
      return next(
        new GenericError(
          "User needs to verify their email.",
          StatusCodes.Unauthorised,
          [ErrorCodes.E01_09]
        )
      );
    }
    if (user.status === UserStatus.AccessRevoked) {
      return next(
        new GenericError("User access revoked.", StatusCodes.Forbidden, [
          ErrorCodes.E01_11,
        ])
      );
    }

    const accessToken = getJwtToken(
      user,
      process.env.JWT_ACCESS_EXPIRY!,
      process.env.JWT_ACCESS_KEY!
    );
    const refreshToken = getJwtToken(
      user,
      process.env.JWT_REFRESH_EXPIRY!,
      process.env.JWT_REFRESH_KEY!
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
    });

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: StatusStrings.OK,
      messages: [SuccessCodes.S01_02],
      data: {
        accessToken,
        user,
      },
    });
  }
);

export { router as signinRouter };
