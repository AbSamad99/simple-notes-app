import { NextFunction, Request, Response, Router } from "express";

// Enums
import {
  StatusCodes,
  SuccessCodes,
} from "../../../constants/application-codes";
import { StatusStrings } from "../../../constants/status-strings";

// Middlewares
import { requireAuth } from "../../../middlewares/auth-middlewares";

// Helpers and Services
import { sendResponse } from "../../../helpers/send-response";

const router = Router();

router.get(
  "/currentUser",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    // delete req.currentUser!.isAdmin;
    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: StatusStrings.OK,
      messages: [SuccessCodes.S01_03],
      data: req.currentUser,
    });
  }
);

export { router as currentUserRouter };
