import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes, SuccessCodes } from "../../constants/application-codes";
import { StatusStrings } from "../../constants/status-strings";
import { sendResponse } from "../../helpers/send-response";
import { requireAuth } from "../../middlewares/auth-middlewares";
import { Note } from "../../models/note";

const router = Router();

router.get(
  "/",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.currentUser!;

    const notes = await Note.find({ userId: id }, "title");

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: StatusStrings.OK,
      messages: [SuccessCodes.S05_03],
      data: notes,
    });
  }
);

export { router as getAllNotesRouter };
