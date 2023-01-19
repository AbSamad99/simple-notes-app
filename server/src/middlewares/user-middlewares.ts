import { NextFunction, Request, Response } from "express";
import { ErrorCodes, StatusCodes } from "../constants/application-codes";
import { GenericError } from "../errors/generic-error";
import { User, UserDocument } from "../models/user";

declare global {
  namespace Express {
    interface Request {
      desiredUser?: UserDocument | null;
    }
  }
}

export const findUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id);
    req.desiredUser = user;
  } catch (error) {
    return next(
      new GenericError("Invalid user id provided.", StatusCodes.BadRequest, [
        ErrorCodes.E01_18,
      ])
    );
  }
  next();
};

export const checkIfUserExists = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.desiredUser) {
    throw new GenericError("User does not exist.", StatusCodes.BadRequest, [
      ErrorCodes.E01_12,
    ]);
  }
  next();
};

export const checkIfUserIsAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.desiredUser!.isAdmin) {
    throw new GenericError("Cannot alter admin user.", StatusCodes.BadRequest, [
      ErrorCodes.E01_17,
    ]);
  }
  next();
};
