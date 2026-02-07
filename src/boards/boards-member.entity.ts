import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  CreateDateColumn,
} from 'typeorm';
import { Board } from './boards.entity';

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

  @Column({
    type: 'enum',
    enum: BoardRole,
    default: BoardRole.MEMBER,
  })
  role: BoardRole;

  @CreateDateColumn()
  joined_at: Date;
}
