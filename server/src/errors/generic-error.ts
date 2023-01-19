import { ResponseStructure } from "../helpers/send-response";
import { AbstractError } from "./abstract-error";

export class GenericError extends AbstractError {
  constructor(
    message: string,
    public statusCode: number,
    public messages: string[]
  ) {
    super(message);
    Object.setPrototypeOf(this, GenericError.prototype);
  }

  serializeError(): ResponseStructure {
    return {
      statusCode: this.statusCode,
      status: this.statusString,
      messages: this.messages,
    };
  }
}
