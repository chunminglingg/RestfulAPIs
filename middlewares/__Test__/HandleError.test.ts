import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../../utils/statusCode";
import { handError } from "../errorHandler";
import { BaseCustomError } from "../../utils/classError";
import { SerializedErrorOutput } from "../../utils/@types/serialized-error-output";

describe("errorHandler middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("handles BaseCustomError correctly", () => {
    const mockError = new BaseCustomError("Test error", StatusCode.BadRequest);

    handError(mockError, req as Request, res as Response, next);
    mockError.serializeErrorOutput = jest.fn().mockReturnValue({
      message: mockError.message,
      statusCode: mockError.statusCode,
    });

    expect(res.status).toHaveBeenCalledWith(StatusCode.BadRequest);
    expect(res.json).toHaveBeenCalledWith(mockError.serializeErrorOutput());
  });

  it("handles generic errors correctly", () => {
    const errMessage = "Text message error";
    // const statusCode = StatusCode.InternalServerError;
    const error = new BaseCustomError(errMessage, StatusCode.BadRequest);
     expect(error instanceof BaseCustomError).toBe(true);
    expect(error.message).toBe(errMessage);
    expect(error.statusCode).toBe(StatusCode.BadRequest);
    expect(error.name).toBe('BaseCustomError');
  });
});
