import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data";
import { Todo, TodoStatus } from "../entity/Todo";
import { User } from "../entity/User";
import { CustomAPIError } from "../errors/custom-error";

export const addTodo = async (req: Request, res: Response) => {
  try {
    const todoRepository = AppDataSource.getRepository(Todo);
    const todo = todoRepository.create(req.body);
    await todoRepository.save(todo);
    return res.status(200).json({ message: "success", todo });
  } catch (error) {
    console.error(error);
    return;
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);
  const user = userRepository.findOneBy({ id: parseInt(req.body.user_id) });
  if (typeof user !== "object") {
    throw new CustomAPIError("Not found user", 404);
  }
  const { id } = req.params;
  const todoRepository = AppDataSource.getRepository(Todo);
  const todo = await todoRepository.findOneBy({
    id: parseInt(id),
  });

  if (!todo) {
    throw new CustomAPIError("Not found todo", 404);
  }
  if (todo?.status !== TodoStatus.COMPLETE) {
    throw new CustomAPIError("Invalid Status's information", 406);
  }
  AppDataSource.getRepository(Todo).merge(todo, req.body);
  await todoRepository.save(todo);
  return res.status(200).json({ message: "success", todo });
};

export const updateTodo2 = async (req: Request, res: Response) => {
  const { user_id, status } = req.body;
  const userRepository = AppDataSource.getRepository(User);
  const user = userRepository.findOne({
    where: { id: parseInt(user_id) },
  });
  if (typeof user !== "object") {
    throw new CustomAPIError("Not found user", 404);
  }
  if (req.body.id) {
    throw new CustomAPIError("Don't change id", 403);
  }
  if (status) {
    // if (status !== TodoStatus.COMPLETE && status !== TodoStatus.NEW) {
    //   res.status(400).json({ message: "Please enter status gain" });
    //   return;
    // }
    if (status! in TodoStatus) {
      throw new CustomAPIError("Please enter status gain", 400);
    }
  }
  const { id } = req.params;
  const todoRepository = AppDataSource.getRepository(Todo);
  let todo = await todoRepository.findOneBy({
    id: parseInt(id),
  });
  if (!todo) {
    throw new CustomAPIError("Not found todo", 404);
  }
  await todoRepository.update({ id: parseInt(req.params.id) }, req.body);
  todo = await todoRepository.findOneBy({ id: parseInt(req.params.id) });
  return res.json({ message: "Updated", todo });
};

export const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const todoRepository = AppDataSource.getRepository(Todo);
  const todo = await todoRepository.findOne({ where: { id: parseInt(id) } });
  if (!todo) {
    throw new CustomAPIError("Not found todo", 404);
  }
  if (todo?.status !== TodoStatus.COMPLETE) {
    throw new CustomAPIError("Invalid Status's information", 406);
  }
  await todoRepository.delete({ id: parseInt(req.params.id) });
  return res.status(200).json({ message: "success", todo });
};

export const getAllTodo = async (req: Request, res: Response) => {
  const { name, user_id, status } = req.body;
  const todoRepository = AppDataSource.getRepository(Todo);
  const todo = await todoRepository.find({
    where: { name: name, user_id: user_id, status: status },
  });
  if (!todo) {
    throw new CustomAPIError("Not found todo", 404);
  }
  return res.status(200).json({ message: "success", todo });
};

export const getByIdTodo = async (req: Request, res: Response) => {
  const todoRepository = AppDataSource.getRepository(Todo);
  const todo = await todoRepository.findOneBy({
    id: parseInt(req.params.id),
  });
  if (!todo) {
    throw new CustomAPIError("Not found todo", 404);
  }
  return res.status(200).json({ message: "success", todo });
};

export const assignTodo = async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);
  const user = userRepository.findOneBy({ id: parseInt(req.body.user_id) });
  if (typeof user !== "object") {
    throw new CustomAPIError("Not found user", 404);
  }
  const todoRepository = AppDataSource.getRepository(Todo);
  const todo = await todoRepository.findOneBy({
    id: parseInt(req.params.id),
  });
  if (!todo) {
    throw new CustomAPIError("Not found todo", 404);
  }
  if (todo?.user_id === req.body.user_id) {
    throw new CustomAPIError("Invalid Status's information", 406);
  } else {
    todo.user_id = parseInt(req.body.user_id);
    await todoRepository.save(todo);
    return res.status(200).json({ message: "success", todo });
  }
};

export const getAllTaskByUser = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  const userRepository = AppDataSource.getRepository(User);
  const user = userRepository.findOneBy({ id: parseInt(user_id) });
  if (typeof user !== "object") {
    throw new CustomAPIError("Not found user", 404);
  }
  const todoRepository = AppDataSource.getRepository(Todo);
  const todo = await todoRepository.find({
    where: { user_id: parseInt(user_id) },
  });
  if (!todo) {
    throw new CustomAPIError("Not found todo", 404);
  }
  return res.status(200).json({ message: "success", todo });
};

export const getTodosPaging = async (req: Request, res: Response) => {
  const todoRepository = AppDataSource.getRepository(Todo);
  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt(req.query.perPage as string) || 5;
  const result = await todoRepository.findAndCount({
    skip: (page - 1) * perPage,
    take: perPage,
  });
  return res.status(200).json({ message: "success", result });
};
