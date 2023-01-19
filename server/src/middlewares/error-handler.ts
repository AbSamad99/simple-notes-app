import { Request, Response, NextFunction } from "express";
import { ErrorCodes, StatusCodes } from "../constants/application-codes";
import { StatusStrings } from "../constants/status-strings";
import { AbstractError } from "../errors/abstract-error";
import { sendResponse } from "../helpers/send-response";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AbstractError) {
    return sendResponse(res, err.serializeError());
  }
  console.log("Handled Generic Custom Error");
  console.error(err);
  return sendResponse(res, {
    statusCode: StatusCodes.BadRequest,
    status: StatusStrings.FAILURE,
    messages: [ErrorCodes.E00_01],
  });
};
