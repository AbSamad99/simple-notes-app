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
import { getJwtToken, validateToken } from "../../../helpers/jwt-helpers";

// Models
import { User } from "../../../models/user";

const router = Router();

router.get(
  "/refresh",
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.jwt;
    if (refreshToken) {
      const payload = validateToken(refreshToken, process.env.JWT_REFRESH_KEY!);
      if (payload) {
        const user = await User.findById(payload.id);
        if (user && user.status !== UserStatus.AccessRevoked) {
          const accessToken = getJwtToken(
            user,
            process.env.JWT_ACCESS_EXPIRY!,
            process.env.JWT_ACCESS_KEY!
          );
          return sendResponse(res, {
            statusCode: StatusCodes.OK,
            status: StatusStrings.OK,
            messages: [SuccessCodes.S02_01],
            data: { accessToken },
          });
        }
        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "none",
          secure: process.env.NODE_ENV === "development",
        });
      }
    }
    return next(
      new GenericError(
        "Invalid refresh token provided.",
        StatusCodes.BadRequest,
        [ErrorCodes.E02_02]
      )
    );
  }
);

export { router as refreshRouter };
