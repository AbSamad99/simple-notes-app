import { NextFunction, Request, Response, Router } from "express";
import { title } from "process";
import {
  ErrorCodes,
  StatusCodes,
  SuccessCodes,
} from "../../constants/application-codes";
import { StatusStrings } from "../../constants/status-strings";
import { GenericError } from "../../errors/generic-error";
import { EncryptionHelper } from "../../helpers/encryption-helper";
import { sendResponse } from "../../helpers/send-response";
import { requireAuth } from "../../middlewares/auth-middlewares";
import { findNote } from "../../middlewares/note-middlewares";

const router = Router();

router.get(
  "/:id",
  requireAuth,
  findNote,
  async (req: Request, res: Response, next: NextFunction) => {
    const note = req.desiredNote!;
    note.body = EncryptionHelper.decrypt({ iv: note.iv, content: note.body });

    if (req.currentUser!.id != req.desiredNote!.userId) {
      return next(
        new GenericError(
          "Note belongs to a different user.",
          StatusCodes.Unauthorised,
          [ErrorCodes.E00_03]
        )
      );
    }

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: StatusStrings.OK,
      messages: [SuccessCodes.S05_04],
      data: note,
    });
  }
);

export { router as getNoteRouter };
