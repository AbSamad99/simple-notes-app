import { randomBytes } from "crypto";
import { NextFunction, Request, Response, Router } from "express";

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
import { emailService } from "../../../services/email-service";

// Models
import { User } from "../../../models/user";
import { PasswordReset } from "../../../models/password-reset";

const validations = [
  getCommonValidationChain("email", ErrorCodes.E01_01)
    .isEmail()
    .normalizeEmail()
    .withMessage(ErrorCodes.E01_02),
];

const router = Router();

router.post(
  "/forgotPassword",
  validations,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new GenericError("Invalid email provided.", StatusCodes.BadRequest, [
          ErrorCodes.E04_01,
        ])
      );
    }

    const secretKey = randomBytes(15).toString("hex");
    const link = `http://localhost:3000/reset-password/${secretKey}`;
    const emailInfo = {
      from: {
        email: "support@notes.com",
        name: "support",
      },
      to: [email],
      subject: "Password Reset",
      text: `Please go to the following link to reset your password: ${link}`,
      html: emailService.getEmailTemplate(
        `
        <h3>Hello ${user.firstName},</h3>
        <p>Please click <a href="${link}">here</a> in order to reset your password.</p>
        `
      ),
    };

    try {
      const info = await emailService.sendMail(emailInfo);
      if (!info || (info.rejected && info.rejected.length)) {
        return next(
          new GenericError(
            "Error occured when sending email.",
            StatusCodes.InternalServerError,
            [ErrorCodes.E03_01]
          )
        );
      }
    } catch (error) {
      return next(
        new GenericError(
          "Error occured when sending email.",
          StatusCodes.InternalServerError,
          [ErrorCodes.E03_01]
        )
      );
    }

    await PasswordReset.deleteMany({
      userId: user.id,
    });

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const passwordReset = PasswordReset.build({
      userId: user.id,
      secretKey: secretKey,
      expiresAt: expiresAt,
    });
    await passwordReset.save();

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: StatusStrings.OK,
      messages: [SuccessCodes.S04_01],
    });
  }
);

export { router as forgotPasswordRouter };
