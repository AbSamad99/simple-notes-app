import { StatusStrings } from "../constants/status-strings";
import { ResponseStructure } from "../helpers/send-response";

export abstract class AbstractError extends Error {
  abstract statusCode: number;
  statusString: string = StatusStrings.FAILURE;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, AbstractError.prototype);
  }
  abstract serializeError(): ResponseStructure;
}
