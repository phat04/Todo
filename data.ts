import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Todo } from "./entity/Todo";

// TODO: Fix path entities

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.HOST_DATABASE,
  port: Number(process.env.PORT_DATABASE),
  username: process.env.USERNAME_DATAASE,
  password: process.env.PASSWORD_DATABASE,
  database: process.env.DATABASE_DATABASE,
  entities: [User, Todo],
  logging: true,
  synchronize: true,
});

export { AppDataSource };
