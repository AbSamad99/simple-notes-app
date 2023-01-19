import { Response } from "express";

export const sendResponse = (
  res: Response,
  responseData: ResponseStructure
) => {
  const { status, messages, data } = responseData;
  return res.status(responseData.statusCode).send({ status, messages, data });
};

export interface ResponseStructure {
  statusCode: number;
  status: string;
  messages: string[];
  data?: any;
}
