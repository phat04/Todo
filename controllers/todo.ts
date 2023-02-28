import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data";
import { Todo, TodoStatus } from "../entity/Todo";
import { User } from "../entity/User";
import { createCustomError } from "../errors/custom-error";

export const addTodo = async (req: Request, res: Response) => {
  try {
    const todoRepository = AppDataSource.getRepository(Todo);
    const todo = todoRepository.create(req.body);
    await todoRepository.save(todo);
    res.status(200).json({ message: "success", todo });
  } catch (error) {
    console.error(error);
    return;
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
    if (typeof user !== "object") {
      return next(createCustomError("Not found user", 404));
    }
    const { id } = req.params;
    const todoRepository = AppDataSource.getRepository(Todo);
    const todo = await todoRepository.findOneBy({
      id: parseInt(id),
    });

    if (!todo) {
      return next(createCustomError("Not found todo", 404));
    }
    if (todo?.status !== TodoStatus.COMPLETE) {
      return next(createCustomError("Invalid Status's information", 406));
    }
    AppDataSource.getRepository(Todo).merge(todo, req.body);
    await todoRepository.save(todo);
    res.status(200).json({ message: "success", todo });
  } catch (error) {
    console.error(error);
    return;
  }
};

export const updateTodo2 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id, status } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.findOne({
      where: { id: parseInt(user_id) },
    });
    if (typeof user !== "object") {
      return next(createCustomError("Not found user", 404));
    }
    if (req.body.id) {
      return next(createCustomError("Don't change id", 403));
    }
    if (status) {
      // if (status !== TodoStatus.COMPLETE && status !== TodoStatus.NEW) {
      //   res.status(400).json({ message: "Please enter status gain" });
      //   return;
      // }
      if (status! in TodoStatus) {
        return next(createCustomError("Please enter status gain", 400));
      }
    }
    const { id } = req.params;
    const todoRepository = AppDataSource.getRepository(Todo);
    let todo = await todoRepository.findOneBy({
      id: parseInt(id),
    });
    if (!todo) {
      return next(createCustomError("Not found todo", 404));
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
    if (!todo) {
      return next(createCustomError("Not found todo", 404));
    }
    if (todo?.status !== TodoStatus.COMPLETE) {
      return next(createCustomError("Invalid Status's information", 406));
    }
    await todoRepository.delete({ id: parseInt(req.params.id) });
    res.status(200).json({ message: "success", todo });
  } catch (error) {
    console.error(error);
    return;
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
    if (!todo) {
      return next(createCustomError("Not found todo", 404));
    }
    res.status(200).json({ message: "success", todo });
  } catch (error) {
    console.error(error);
    return;
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
    if (!todo) {
      return next(createCustomError("Not found todo", 404));
    }
    res.status(200).json({ message: "success", todo });
  } catch (error) {
    console.error(error);
    return;
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
    if (typeof user !== "object") {
      return next(createCustomError("Not found user", 404));
    }
    const todoRepository = AppDataSource.getRepository(Todo);
    const todo = await todoRepository.findOneBy({
      id: parseInt(req.params.id),
    });
    if (!todo) {
      return next(createCustomError("Not found todo", 404));
    }
    if (todo?.user_id === req.body.user_id) {
      return next(createCustomError("Invalid Status's information", 406));
    } else {
      todo.user_id = parseInt(req.body.user_id);
      await todoRepository.save(todo);
    }
    res.status(200).json({ message: "success", todo });
  } catch (error) {
    console.error(error);
    return;
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
    if (typeof user !== "object") {
      return next(createCustomError("Not found user", 404));
    }
    const todoRepository = AppDataSource.getRepository(Todo);
    const todo = await todoRepository.find({
      where: { user_id: parseInt(user_id) },
    });
    if (!todo) {
      return next(createCustomError("Not found todo", 404));
    }
    res.status(200).json({ message: "success", todo });
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getTodosPaging = async (req: Request, res: Response) => {
  try {
    const todoRepository = AppDataSource.getRepository(Todo);
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 5;
    const result = await todoRepository.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
    });
    res.status(200).json({ message: "success", result });
  } catch (error) {
    console.error(error);
    return;
  }
};
