import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export enum TodoStatus {
  NEW = "new",
  COMPLETE = "complete",
}

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  user_id: number;

  @Column()
  date_of_completion!: Date;

  @Column({
    default: TodoStatus.NEW,
    type: "enum",
    enum: TodoStatus,
  })
  status!: TodoStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // constructor(name:string, description:string, user_id:number, date_of_completion:Date, status:TodoStatus, date_of_creation:Date, date_of_modification:Date){
  //     this.name = name
  //     this.description=description
  //     this.user_id=user_id
  //     this.date_of_completion=date_of_completion
  //     this.status=status
  //     this.date_of_creation=date_of_creation
  //     this.date_of_modification=date_of_modification
  // }
}
