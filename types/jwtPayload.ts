import { type } from "os";

export type JwtPayload = {
  id: number;

  name: string;

  email: string;

  password: string;
};
