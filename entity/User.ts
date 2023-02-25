import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import bcrypt from "bcryptjs";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkPassword(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
