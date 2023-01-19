import { StatusCodes } from "../constants/application-codes";
import { AbstractError } from "./abstract-error";
import { ValidationError } from "express-validator";
import { ResponseStructure } from "../helpers/send-response";

export class RequestValidationError extends AbstractError {
  statusCode: number = StatusCodes.BadRequest;

  constructor(private errors: ValidationError[]) {
    super("Error during validation of request.");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeError(): ResponseStructure {
    const errorMessages = this.errors.map((err) => {
      return err.msg;
    });
    return {
      statusCode: this.statusCode,
      status: this.statusString,
      messages: [...new Set(errorMessages)],
    };
  }
}
