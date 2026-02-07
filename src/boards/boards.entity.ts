import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { BoardMember } from './boards-member.entity';
import { BoardColumn } from 'src/columns/column.entity';
import { Task } from 'src/tasks/task.entity';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => BoardMember, (member) => member.board, { cascade: true })
  members: BoardMember[];

  @OneToMany(() => BoardColumn, (column) => column.board, { cascade: true })
  columns: BoardColumn[];

  @OneToMany(() => Task, (task) => task.board)
  tasks: Task[];
}
