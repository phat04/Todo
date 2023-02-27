import e, { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../data";
import { createToken } from "../middleware/createJwtToken";
import { JwtPayload } from "../types/jwtPayload";

export const sign_up = async (
  req: Request,
  res: Response,
  neet: NextFunction
) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = new User();
    //const user = userRepository.create(req.body);
    const { name, email, password } = req.body;
    user.name = name;
    user.email = email;
    user.password = password;
    user.hashPassword();
    const result = await userRepository.save(user);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
  }
};

export const sign_in = async (
  req: Request,
  res: Response,
  neet: NextFunction
) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { name, password } = req.body;
    const user = await userRepository.findOne({ where: { name } });
    if (user) {
      const JwtPayload: JwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
      };
      const accessToken = createToken(JwtPayload);
      user?.checkPassword(password) &&
        res.status(200).json({ accessToken: accessToken });
    } else {
      return res.status(404).json({
        message:
          "Not found User with name:" + name + " and password:" + password,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const getAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.find();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
  }
};
