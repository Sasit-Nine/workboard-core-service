import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Board } from 'src/boards/boards.entity';
import { BoardColumn } from 'src/columns/column.entity';
import { BoardMember } from 'src/boards/boards-member.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Board, (board) => board.tasks, {
    onDelete: 'CASCADE',
  })
  board: Board;

  @ManyToOne(() => BoardColumn, (column) => column.tasks, {
    onDelete: 'CASCADE',
  })
  column: BoardColumn;

  @ManyToOne(() => BoardMember, (m) => m.createdTasks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  createdBy: BoardMember;

  @ManyToOne(() => BoardMember, (m) => m.assignedTasks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  assignTo?: BoardMember;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', default: 0 })
  position: number;

  @CreateDateColumn()
  created_at: Date;
  task: { id: number };
}
