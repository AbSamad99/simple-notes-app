import { NextFunction, Request, Response, Router } from "express";
import {
  ErrorCodes,
  StatusCodes,
  SuccessCodes,
} from "../../constants/application-codes";
import { StatusStrings } from "../../constants/status-strings";
import { sendResponse } from "../../helpers/send-response";
import { getCommonValidationChain } from "../../helpers/validation-helpers";
import { requireAuth } from "../../middlewares/auth-middlewares";
import { findNote } from "../../middlewares/note-middlewares";
import { validateRequest } from "../../middlewares/validate-request";

const router = Router();

const validations = [
  getCommonValidationChain("title", ErrorCodes.E05_01)
    .isLength({ max: 30 })
    .withMessage(ErrorCodes.E05_03),
  getCommonValidationChain("body", ErrorCodes.E05_02)
    .isLength({ max: 30 })
    .withMessage(ErrorCodes.E05_04),
];

router.put(
  "/update/:id",
  requireAuth,
  validations,
  validateRequest,
  findNote,
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, body } = req.body;
    const { id } = req.currentUser!;

    const note = req.desiredNote!;
    note.set({ title, body, userId: id });
    await note.save();

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: StatusStrings.OK,
      messages: [SuccessCodes.S05_02],
    });
  }
);

export { router as updateNoteRouter };
