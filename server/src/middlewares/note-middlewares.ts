import { NextFunction, Request, Response } from "express";
import { ErrorCodes, StatusCodes } from "../constants/application-codes";
import { GenericError } from "../errors/generic-error";
import { Note, NoteDocument } from "../models/note";

declare global {
  namespace Express {
    interface Request {
      desiredNote?: NoteDocument | null;
    }
  }
}

export const findNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const note = await Note.findById(req.params.id);
    req.desiredNote = note;
  } catch (error) {
    return next(
      new GenericError("Invalid note id provided.", StatusCodes.BadRequest, [
        ErrorCodes.E05_05,
      ])
    );
  }
  next();
};
