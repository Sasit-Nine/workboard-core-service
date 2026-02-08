import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Board } from './boards.entity';
import { Task } from 'src/tasks/task.entity';

export enum BoardRole {
  OWNER = 'OWNER',
  MEMBER = 'MEMBER',
}

@Entity('board_members')
@Unique(['board', 'email'])
export class BoardMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Board, (board) => board.members, {
    onDelete: 'CASCADE',
  })
  board: Board;

  @Column({ type: 'varchar' })
  email: string;

  @OneToMany(() => Task, (t) => t.createdBy)
  createdTasks: Task[];

  @OneToMany(() => Task, (t) => t.assignTo)
  assignedTasks: Task[];

  @Column({
    type: 'enum',
    enum: BoardRole,
    default: BoardRole.MEMBER,
  })
  role: BoardRole;

  @CreateDateColumn()
  joined_at: Date;
}
