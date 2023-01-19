import { body } from "express-validator";
import { ErrorCodes } from "../constants/application-codes";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      MONGO_URI: string;
      JWT_ACCESS_KEY: string;
      JWT_REFRESH_KEY: string;
      JWT_ACCESS_EXPIRY: string;
      JWT_REFRESH_EXPIRY: string;
      EMAIL_HOST: string;
      EMAIL_PORT: number;
      EMAIL_USERNAME: string;
      EMAIL_PASSWORD: string;
      ENCRYPTION_KEY: string;
    }
  }
}

export const getCommonValidationChain = (
  param: string,
  errorCode: ErrorCodes
) => {
  return body(param).trim().notEmpty().withMessage(errorCode).bail();
};

export const getCommonValidationChainOptional = (
  param: string,
  errorCode: ErrorCodes
) => {
  return body(param)
    .optional({ nullable: true })
    .trim()
    .notEmpty()
    .withMessage(errorCode)
    .bail();
};

export const getCommonValidationChainNonString = (
  param: string,
  errorCode: ErrorCodes
) => {
  return body(param).notEmpty().withMessage(errorCode).bail();
};

export const validateEnvVariables = () => {
  if (!process.env.PORT) {
    throw new Error("PORT is undefined.");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is undefined.");
  }
  if (!process.env.JWT_ACCESS_KEY) {
    throw new Error("JWT_ACCESS_KEY is undefined.");
  }
  if (!process.env.JWT_REFRESH_KEY) {
    throw new Error("JWT_REFRESH_KEY is undefined.");
  }
  if (!process.env.JWT_ACCESS_EXPIRY) {
    throw new Error("JWT_ACCESS_EXPIRY is undefined.");
  }
  if (!process.env.JWT_REFRESH_EXPIRY) {
    throw new Error("JWT_REFRESH_EXPIRY is undefined.");
  }
  if (!process.env.EMAIL_HOST) {
    throw new Error("EMAIL_HOST is undefined.");
  }
  if (!process.env.EMAIL_PORT) {
    throw new Error("EMAIL_PORT is undefined.");
  }
  if (!process.env.EMAIL_USERNAME) {
    throw new Error("EMAIL_USERNAME is undefined.");
  }
  if (!process.env.EMAIL_PASSWORD) {
    throw new Error("EMAIL_PASSWORD is undefined.");
  }
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY is undefined.");
  }
};
