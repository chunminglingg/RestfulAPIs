import { NextFunction, Request, Response } from "express";
import { BaseCustomError } from "../utils/classError";
import { StatusCode } from "../utils/statusCode";

export const handError = (err: any , req: Request, res: Response, next: NextFunction) => {
  if (err instanceof BaseCustomError) {
    const { statusCode, message } = err;
    try {
      const parsedMessage = JSON.parse(message);
      res.status(StatusCode.Accepted).json({ statusCode, message: parsedMessage });
    } catch (parseErr) {
      res.status(StatusCode.InternalServerError).json({ statusCode, message });
    }
  } else {
    next(err);
  }
};
