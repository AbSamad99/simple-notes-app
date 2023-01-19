import { Request, Response, NextFunction } from "express";
import { ErrorCodes, StatusCodes } from "../constants/application-codes";
import { UserStatus } from "../constants/user-status";
import { GenericError } from "../errors/generic-error";
import { UserPayload, validateToken } from "../helpers/jwt-helpers";
import { User } from "../models/user";

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return next();
  }
  const payload = validateToken(
    req.headers.authorization,
    process.env.JWT_ACCESS_KEY!
  );
  if (payload) {
    const user = await User.findById(payload.id);
    if (user && user.status !== UserStatus.AccessRevoked) {
      req.currentUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
      };
    }
  }
  next();
};

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new GenericError(
      "User is not authorised.",
      StatusCodes.Unauthorised,
      [ErrorCodes.E00_03]
    );
  }
  next();
};

export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser?.isAdmin) {
    console.log("here");
    throw new GenericError(
      "User does not have admin permissions.",
      StatusCodes.Unauthorised,
      [ErrorCodes.E00_04]
    );
  }
  next();
};
