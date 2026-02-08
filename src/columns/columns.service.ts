import { Injectable } from '@nestjs/common';
import { BoardColumn } from './column.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardsService } from 'src/boards/boards.service';
@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(BoardColumn)
    private columnsRepository: Repository<BoardColumn>,
    private readonly boardsService: BoardsService,
  ) {}

  async createColumn(name: string, boardId: number, email: string) {
    try {
      const checkPermission = await this.boardsService.checkPermission(
        boardId,
        email,
      );
      if (!checkPermission.isMember) {
        throw new Error('Only board members can create columns');
      }
      const existingColumns = await this.columnsRepository.count({
        where: { board: { id: boardId } },
      });
      const column = this.columnsRepository.create({
        name: name,
        board: { id: boardId },
        position: existingColumns,
      });
      const savedColumn = await this.columnsRepository.save(column);
      return savedColumn;
    } catch {
      throw new Error('Could not create column');
    }
  }

  async deleteColumn(columnId: number, email: string) {
    try {
      const column = await this.columnsRepository.findOne({
        where: { id: columnId },
        relations: ['board'],
      });
      if (!column) {
        throw new Error('Column not found');
      }
      const boardId = column.board.id;
      const checkPermission = await this.boardsService.checkPermission(
        boardId,
        email,
      );
      if (!checkPermission.isMember) {
        throw new Error('Only board members can delete columns');
      }
      await this.columnsRepository.delete(columnId);
      return { message: 'Column deleted successfully' };
    } catch {
      throw new Error('Could not delete column');
    }
  }

  async editColumnName(columnId: number, name: string, email: string) {
    try {
      const column = await this.columnsRepository.findOne({
        where: { id: columnId },
        relations: ['board'],
      });
      if (!column) {
        throw new Error('Column not found');
      }
      const boardId = column.board.id;
      const checkPermission = await this.boardsService.checkPermission(
        boardId,
        email,
      );
      if (!checkPermission.isMember) {
        throw new Error('Only board members can edit columns');
      }
      column.name = name;
      const updatedColumn = await this.columnsRepository.save(column);
      return updatedColumn;
    } catch {
      throw new Error('Could not edit column name');
    }
  }

  async editPosition(columnId: number, position: number, email: string) {
    try {
      const column = await this.columnsRepository.findOne({
        where: { id: columnId },
        relations: ['board'],
      });
      if (!column) {
        throw new Error('Column not found');
      }
      const boardId = column.board.id;
      const checkPermission = await this.boardsService.checkPermission(
        boardId,
        email,
      );
      if (!checkPermission.isMember) {
        throw new Error('Only board members can edit columns');
      }
      column.position = position;
      const updatedColumn = await this.columnsRepository.save(column);
      return updatedColumn;
    } catch {
      throw new Error('Could not edit column position');
    }
  }
}
