import express, { Response, Request, NextFunction } from "express";
import mongoose from "mongoose";
import { BaseCustomError } from "../utils/classError";
import { StatusCode } from "../utils/statusCode";

export const mongooseMid = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const customeErr = new BaseCustomError("Syntax error", StatusCode.BadRequest);
    next(customeErr);
  }
  next();
};
