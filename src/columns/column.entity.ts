import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Board } from 'src/boards/boards.entity';
import { Task } from 'src/tasks/task.entity';

@Entity('columns')
export class BoardColumn {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Board, (board) => board.columns, {
    onDelete: 'CASCADE',
  })
  board: Board;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int', default: 0 })
  position: number;

  @OneToMany(() => Task, (task) => task.column)
  tasks: Task[];
}
