import jwt from "jsonwebtoken";
import "dotenv/config";
import { JwtPayload } from "../types/jwtPayload";
export const createToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, "lama", { expiresIn: "1d" });
};
