import jwt from "jsonwebtoken";
import { UserDocument } from "../models/user";

export interface UserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
}

export const getJwtToken = (user: UserDocument, time: string, key: string) => {
  const { id } = user;
  return jwt.sign({ id }, key, { expiresIn: time });
};

export const validateToken = (
  token: string,
  key: string
): UserPayload | undefined => {
  try {
    const payload = jwt.verify(token, key) as UserPayload;
    return payload;
  } catch (error) {
    return undefined;
  }
};
