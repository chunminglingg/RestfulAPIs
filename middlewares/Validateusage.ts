import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { BaseCustomError } from "../utils/classError";
import { StatusCode } from "../utils/statusCode";

export const validate =
  (schema: z.AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.issues.reduce(
          (acc: { [key: string | number]: string }, issue) => {
            acc[issue.path[0]] = issue.message;
            return acc;
          },
          {}
        );
        // return res.status(400).json({ error: formattedErrors });
        const formatted = JSON.stringify(formattedErrors);
        const formattedError = new BaseCustomError(formatted, 404);
        next(formattedError);
      } else {
        console.error("Unexpected error:", error);
        res
          .status(StatusCode.BadRequest)
          .json({ error: "Internal Server Error" });
      }
    }
  };
