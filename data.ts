import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Todo } from "./entity/Todo";

// TODO: Fix path entities

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "root",
  database: "test",
  entities: [User, Todo],
  logging: true,
  synchronize: true,
});

export { AppDataSource };
