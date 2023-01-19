import { Request, Router, Response, NextFunction } from "express";
import { randomBytes } from "crypto";

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
import { EmailVerification } from "../../../models/email-verification";

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
  "/signup",
  validations,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        new GenericError("Email already in use", StatusCodes.BadRequest, [
          ErrorCodes.E01_08,
        ])
      );
    }

    const secretKey = randomBytes(15).toString("hex");
    const link = `http://localhost:3000/verify-email/${secretKey}`;
    const emailInfo = {
      from: {
        email: "support@notes.com",
        name: "support",
      },
      to: [email],
      subject: "Verify Email",
      text: `Please go to the following link to reset your password: ${link}`,
      html: emailService.getEmailTemplate(
        `
        <h3>Hello ${firstName},</h3>
        <p>Please click <a href="${link}">here</a> in order to verify your email.</p>
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

    const emailVerification = EmailVerification.build({ secretKey });
    await emailVerification.save();

    const newUser = User.build({
      firstName,
      lastName,
      email,
      password,
      emailVerification,
    });
    await newUser.save();

    return sendResponse(res, {
      statusCode: StatusCodes.Created,
      status: StatusStrings.OK,
      messages: [SuccessCodes.S01_01],
      data: newUser,
    });
  }
);

export { router as signUpRouter };
