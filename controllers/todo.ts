import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data";
import { Todo, TodoStatus } from "../entity/Todo";
import { User } from "../entity/User";

export const addTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todoRepository = AppDataSource.getRepository(Todo);
    const todo = todoRepository.create(req.body);
    await todoRepository.save(todo);
    res.status(200).json(todo);
  } catch (error) {
    console.error(error);
  }
};

export const updateTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.findOneBy({ id: parseInt(req.body.user_id) });
    if (!typeof user) {
      res.status(404).json({ message: "Not found user with this id" });
      return;
    }
    const { id } = req.params;
    const todoRepository = AppDataSource.getRepository(Todo);
    const todo = await todoRepository.findOneBy({
      id: parseInt(id),
    });

    if (!todo || todo?.status !== TodoStatus.COMPLETE) {
      return;
    }
    AppDataSource.getRepository(Todo).merge(todo, req.body);
    await todoRepository.save(todo);
    res.status(200).json(todo);
  } catch (error) {
    console.error(error);
  }
};

export const updateTodo2 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.findOne({
      where: { id: user_id },
    });
    if (!typeof user) {
      res.status(404).json({ message: "Not found user with this id" });
      return;
    }
    if (req.body.id) {
      res.status(500).json({ message: "Don't change id" });
      return;
    }
    if (req.body.status) {
      if (
        req.body.status !== TodoStatus.COMPLETE &&
        req.body.status !== TodoStatus.NEW
      ) {
        res.status(400).json({ message: "Please enter status gain" });
        return;
      }
    }
    const { id } = req.params;
    const todoRepository = AppDataSource.getRepository(Todo);
    let todo = await todoRepository.findOneBy({
      id: parseInt(id),
    });
    if (!todo) {
      res.status(404).json({ message: "Not found todo with id" });
    }
    await todoRepository.update({ id: parseInt(req.params.id) }, req.body);
    todo = await todoRepository.findOneBy({ id: parseInt(req.params.id) });
    res.json({ message: "Updated", todo });
  } catch (error) {
    console.error(error);
    return;
  }
};

export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const todoRepository = AppDataSource.getRepository(Todo);
    const todo = await todoRepository.findOne({ where: { id: parseInt(id) } });
    if (!todo || todo?.status !== TodoStatus.COMPLETE) {
      return;
    }
    await todoRepository.delete({ id: parseInt(req.params.id) });
    res.json(todo);
  } catch (error) {
    console.error(error);
  }
};

export const getAllTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, user_id, status } = req.body;
    const todoRepository = AppDataSource.getRepository(Todo);
    const todo = await todoRepository.find({
      where: { name: name, user_id: user_id, status: status },
    });
    res.json(todo);
  } catch (error) {
    console.error(error);
  }
};

export const getByIdTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todoRepository = AppDataSource.getRepository(Todo);
    const todo = await todoRepository.findOneBy({
      id: parseInt(req.params.id),
    });
    res.status(200).json({ message: "success", todo });
  } catch (error) {
    console.error(error);
  }
};

export const assignTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.findOneBy({ id: parseInt(req.body.user_id) });
    if (!typeof user) {
      res.status(404).json({ message: "Not found user with this id" });
      return;
    }
    const todoRepository = AppDataSource.getRepository(Todo);
    const todo = await todoRepository.findOneBy({
      id: parseInt(req.params.id),
    });

    if (!todo) {
      return;
    }

    if (todo?.user_id === req.body.user_id) {
      return;
    } else {
      todo.user_id = parseInt(req.body.user_id);
      await todoRepository.save(todo);
    }
    res.json(todo);
  } catch (error) {
    console.error(error);
  }
};

export const getAllTaskByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.findOneBy({ id: parseInt(user_id) });
    if (!typeof user) {
      res.status(404).json({ message: "Not found user with this id" });
      return;
    }
    const todoRepository = AppDataSource.getRepository(Todo);
    const todo = await todoRepository.find({
      where: { user_id: parseInt(user_id) },
    });
    res.json(todo);
  } catch (error) {
    console.error(error);
  }
};

export const pagination = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todoRepository = AppDataSource.getRepository(Todo);
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 5;
    const result = await todoRepository.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
    });
    console.log(perPage);

    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
  }
};
