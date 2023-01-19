import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes, SuccessCodes } from "../../constants/application-codes";
import { StatusStrings } from "../../constants/status-strings";
import { sendResponse } from "../../helpers/send-response";
import { requireAuth } from "../../middlewares/auth-middlewares";
import { findNote } from "../../middlewares/note-middlewares";

const router = Router();

router.delete(
  "/delete/:id",
  requireAuth,
  findNote,
  async (req: Request, res: Response, next: NextFunction) => {
    const note = req.desiredNote!;
    await note.delete();

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: StatusStrings.OK,
      messages: [SuccessCodes.S05_05],
    });
  }
);

export { router as deleteNoteRouter };
