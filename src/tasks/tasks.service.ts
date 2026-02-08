import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { BoardsService } from 'src/boards/boards.service';
import { BoardColumn } from 'src/columns/column.entity';
import { BoardMember } from 'src/boards/boards-member.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly boardsService: BoardsService,
  ) {}

  async createTask(
    title: string,
    description: string,
    boardId: number,
    columnId: number,
    assign_to: number | null,
    create_by: number,
    email: string,
  ) {
    try {
      const checkPermission = await this.boardsService.checkPermission(
        boardId,
        email,
      );
      if (!checkPermission.isMember) {
        throw new Error('Only board members can create tasks');
      }
      const existingTasks = await this.tasksRepository.count({
        where: { column: { id: columnId } },
      });
      const task = this.tasksRepository.create({
        title,
        description,
        board: { id: boardId },
        column: { id: columnId },
        ...(assign_to != null ? { assignTo: { id: assign_to } } : {}),
        createdBy: { id: create_by },
        position: existingTasks,
      });

      return await this.tasksRepository.save(task);
    } catch {
      throw new Error('Could not create task');
    }
  }

  async deleteTask(taskId: number, email: string, boardId: number) {
    try {
      const checkPermission = await this.boardsService.checkPermission(
        boardId,
        email,
      );
      if (!checkPermission.isMember) {
        throw new Error('Only board members can delete tasks');
      }
      await this.tasksRepository.delete(taskId);
      return { message: 'Task deleted successfully' };
    } catch {
      throw new Error('Could not delete task');
    }
  }

  async editTaskDetails(
    taskId: number,
    title: string,
    description: string,
    assign_to: number | null,
    email: string,
    boardId: number,
  ) {
    try {
      const checkPermission = await this.boardsService.checkPermission(
        boardId,
        email,
      );
      if (!checkPermission.isMember) {
        throw new Error('Only board members can edit tasks');
      }
      const task = await this.tasksRepository.findOne({
        where: { id: taskId },
      });
      if (!task) {
        throw new Error('Task not found');
      }
      task.title = title;
      task.description = description;
      if (assign_to !== null) {
        const assignedMember = await this.tasksRepository.manager.findOne(
          BoardMember,
          {
            where: { id: assign_to },
          },
        );
        task.assignTo = assignedMember || undefined;
        if (!task.assignTo) {
          throw new Error('Assigned member not found');
        }
      } else {
        task.assignTo = undefined;
      }
      return await this.tasksRepository.save(task);
    } catch {
      throw new Error('Could not edit task details');
    }
  }

  async editTaskPosition(
    taskId: number,
    newPosition: number,
    newColumnId: number,
    email: string,
    boardId: number,
  ) {
    try {
      const checkPermission = await this.boardsService.checkPermission(
        boardId,
        email,
      );

      if (!checkPermission.isMember) {
        throw new Error('Only board members can edit task positions');
      }

      const task = await this.tasksRepository.findOne({
        where: { id: taskId },
        relations: ['column'],
      });

      if (!task) throw new Error('Task not found');

      const fromColumnId = task.column.id;

      const newColumn = await this.tasksRepository.manager.findOne(
        BoardColumn,
        {
          where: { id: newColumnId },
        },
      );

      if (!newColumn) throw new Error('Column not found');

      const fromTasks = await this.tasksRepository.find({
        where: { column: { id: fromColumnId } },
        order: { position: 'ASC' },
      });

      const fromFiltered = fromTasks.filter((t) => t.id !== taskId);

      fromFiltered.forEach((t, index) => {
        t.position = index;
      });

      await this.tasksRepository.save(fromFiltered);

      const toTasks = await this.tasksRepository.find({
        where: { column: { id: newColumnId } },
        order: { position: 'ASC' },
      });

      const insertIndex = Math.max(0, Math.min(newPosition, toTasks.length));

      task.column = newColumn;

      const newList = [...toTasks];
      newList.splice(insertIndex, 0, task);

      newList.forEach((t, index) => {
        t.position = index;
      });

      await this.tasksRepository.save(newList);

      return task;
    } catch (err) {
      console.error('editTaskPosition error:', err);
      throw new Error('Could not edit task position');
    }
  }

  async getTaskById(taskId: number) {
    return this.tasksRepository.findOne({
      where: { id: taskId },
      relations: ['assignTo', 'createdBy', 'column'],
    });
  }
}
