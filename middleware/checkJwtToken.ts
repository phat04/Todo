import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const checkJwtToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).json({ message: "please provide Token" });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, "lama");
    next();
  } catch (error) {
    console.error(error);
  }
};
