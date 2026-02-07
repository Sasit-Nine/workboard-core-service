import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './boards.entity';
import { BoardMember } from './boards-member.entity';
import { BoardRole } from './boards-member.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardsRepository: Repository<Board>,
    @InjectRepository(BoardMember)
    private boardMembersRepository: Repository<BoardMember>,
  ) {}

  async createBoard(name: string, email: string) {
    try {
      const board = this.boardsRepository.create({
        name: name,
        members: [{ email: email, role: BoardRole.OWNER }],
        columns: [
          {
            name: 'To Do',
            position: 0,
          },
          {
            name: 'In Progress',
            position: 1,
          },
          {
            name: 'Done',
            position: 2,
          },
        ],
      });
      const savedBoard = await this.boardsRepository.save(board);
      return savedBoard;
    } catch {
      throw new Error('Could not create board');
    }
  }

  async deleteBoard(boardId: number, email: string) {
    try {
      console.log('Email:', email);
      console.log('Board ID:', boardId);
      const checkPermission = await this.checkPermission(boardId, email);
      if (!checkPermission.isOwner) {
        throw new Error('Only the board owner can delete the board');
      }
      await this.boardsRepository.delete(boardId);
      return { message: 'Board deleted successfully' };
    } catch {
      throw new Error('Could not delete board');
    }
  }

  async checkPermission(boardId: number, email: string) {
    const boardMember = await this.boardMembersRepository.findOne({
      where: { board: { id: boardId }, email },
    });
    if (!boardMember) {
      return {
        isOwner: false,
        isMember: false,
      };
    } else {
      return {
        isOwner: boardMember.role === BoardRole.OWNER,
        isMember: true,
      };
    }
  }

  async editBoardName(boardId: number, newName: string, email: string) {
    try {
      const checkPermission = await this.checkPermission(boardId, email);
      if (!checkPermission.isMember) {
        throw new Error('Only board members can edit the board name');
      }
      const board = await this.boardsRepository.findOne({
        where: { id: boardId },
      });
      if (!board) {
        throw new Error('Board not found');
      }
      board.name = newName;
      const updatedBoard = await this.boardsRepository.save(board);
      return updatedBoard;
    } catch {
      throw new Error('Could not edit board name');
    }
  }

  async getBoardById(boardId: number) {
    try {
      return this.boardsRepository.findOne({
        where: { id: boardId },
        relations: ['members', 'columns', 'columns.tasks'],
      });
    } catch (error) {
      throw new Error('Could not get board');
    }
  }

  async getAllBoards(email: string) {
    try {
      return await this.boardMembersRepository.find({
        where: { email },
        relations: ['board'],
      });
    } catch {
      throw new Error('Could not get boards');
    }
  }
}
