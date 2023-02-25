import { Router } from "express";
import {
  addTodo,
  deleteTodo,
  updateTodo2,
  updateTodo,
  getAllTodo,
  assignTodo,
  getAllTaskByUser,
  getByIdTodo,
} from "../controllers/todo";

const router = Router();

router.route("/").post(addTodo).get(getAllTodo);
router.route("/updateTodo").post(updateTodo);
router.route("/updateTodo2/:id").post(updateTodo2);
router.route("/deleteTodo/:id").delete(deleteTodo);
router.route("/getByIdTodo/:id").get(getByIdTodo);
router.route("/assignTodo/:id").post(assignTodo);
router.route("/getAllTaskByUser/:user_id").get(getAllTaskByUser);
export default router;
