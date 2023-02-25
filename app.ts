import express from "express";
import userRouter from "./routes/user";
import todoRouter from "./routes/todo";
import "reflect-metadata";
import "dotenv/config";
import { AppDataSource } from "./data";
import { checkJwtToken } from "./middleware/checkJwtToken";

export function log1() {
  console.log(__dirname);
}

AppDataSource.initialize()
  .then(() => {
    // log1()
    log1();
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

const app = express();

app.use(express.json());
app.use("/user", userRouter);
app.use("/todo", checkJwtToken, todoRouter);

app.listen(3000, () => {
  console.log("the server is running on port 3000");
});
