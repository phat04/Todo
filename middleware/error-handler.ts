import { NextFunction, Request, Response, request, response } from "express";
import { CustomAPIError } from "../errors/custom-error";

export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response
) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  res.status(500).json({ msg: "somethings are wrong" });
};
