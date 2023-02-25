import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data";
import { Todo, TodoStatus } from "../entity/Todo";

export const addTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todoRepository = AppDataSource.getRepository(Todo);
    const todo = todoRepository.create(req.body);
    await todoRepository.save(todo);
    res.json(todo);
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
    res.json(todo);
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
    const todoRepository = AppDataSource.getRepository(Todo);
    const todo = await todoRepository.update(
      { id: parseInt(req.params.id) },
      req.body
    );
    res.json(todo);
  } catch (error) {
    console.error(error);
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
    const todoRepository = AppDataSource.getRepository(Todo);
    const todo = await todoRepository.find();
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
    res.json(todo);
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
    const todoRepository = AppDataSource.getRepository(Todo);
    const todo = await todoRepository.find({
      where: { user_id: parseInt(user_id) },
    });
    res.json(todo);
  } catch (error) {
    console.error(error);
  }
};
