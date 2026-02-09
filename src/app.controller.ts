import { BoardsService } from './boards/boards.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthRequest } from './auth/auth-type.type';
import { ColumnsService } from './columns/columns.service';
import { TasksService } from './tasks/tasks.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly BoardsService: BoardsService,
    private readonly ColumnsService: ColumnsService,
    private readonly TasksService: TasksService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/core-service/boards/create-board')
  async createBoard(@Body() data: { name: string }, @Req() req: AuthRequest) {
    return this.BoardsService.createBoard(data.name, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/core-service/boards/delete-board')
  async deleteBoard(
    @Body() data: { boardId: number },
    @Req() req: AuthRequest,
  ) {
    return this.BoardsService.deleteBoard(data.boardId, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/core-service/boards/edit-board')
  async editBoard(
    @Body() data: { boardId: number; name: string },
    @Req() req: AuthRequest,
  ) {
    return this.BoardsService.editBoardName(
      data.boardId,
      data.name,
      req.user.email,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/core-service/columns/create-column')
  async createColumn(
    @Body() data: { name: string; boardId: number },
    @Req() req: AuthRequest,
  ) {
    return this.ColumnsService.createColumn(
      data.name,
      data.boardId,
      req.user.email,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/core-service/columns/delete-column')
  async deleteColumn(
    @Body() data: { columnId: number },
    @Req() req: AuthRequest,
  ) {
    return this.ColumnsService.deleteColumn(data.columnId, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/core-service/columns/edit-column')
  async editColumn(
    @Body() data: { columnId: number; name: string },
    @Req() req: AuthRequest,
  ) {
    return this.ColumnsService.editColumnName(
      data.columnId,
      data.name,
      req.user.email,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/core-service/columns/edit-column-position')
  async editColumnPosition(
    @Body() data: { column_id: number; columnOrder: number },
    @Req() req: AuthRequest,
  ) {
    return this.ColumnsService.editPosition(
      data.column_id,
      data.columnOrder,
      req.user.email,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/core-service/task/create-task')
  async createTask(
    @Body()
    data: {
      title: string;
      description: string;
      boardId: number;
      columnId: number;
      assign_to: number | null;
      create_by: number;
    },
    @Req() req: AuthRequest,
  ) {
    return this.TasksService.createTask(
      data.title,
      data.description,
      data.boardId,
      data.columnId,
      data.assign_to,
      data.create_by,
      req.user.email,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/core-service/task/delete-task')
  async deleteTask(
    @Body() data: { taskId: number; boardId: number },
    @Req() req: AuthRequest,
  ) {
    return this.TasksService.deleteTask(
      data.taskId,
      req.user.email,
      data.boardId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/core-service/task/edit-task')
  async editTask(
    @Body()
    data: {
      taskId: number;
      title: string;
      description: string;
      assign_to: number | null;
      boardId: number;
    },
    @Req() req: AuthRequest,
  ) {
    return this.TasksService.editTaskDetails(
      data.taskId,
      data.title,
      data.description,
      data.assign_to,
      req.user.email,
      data.boardId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/core-service/task/edit-task-position')
  async editTaskPosition(
    @Body()
    data: {
      taskId: number;
      newColumnId: number;
      newPosition: number;
      boardId: number;
    },
    @Req() req: AuthRequest,
  ) {
    return this.TasksService.editTaskPosition(
      data.taskId,
      data.newPosition,
      data.newColumnId,
      req.user.email,
      data.boardId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/core-service/boards/get-board/:id')
  async getBoard(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.BoardsService.getBoardById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/core-service/task/get-task/:id')
  async getTask(@Param('id') id: string) {
    return this.TasksService.getTaskById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/core-service/boards/get-all-boards')
  async getAllBoards(@Req() req: AuthRequest) {
    return this.BoardsService.getAllBoards(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/core-service/boards/add-board-member')
  async addBoardMember(
    @Body() data: { boardId: number; memberEmail: string },
    @Req() req: AuthRequest,
  ) {
    return this.BoardsService.addMemberToBoard(
      data.boardId,
      data.memberEmail,
      req.user.email,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/core-service/boards/remove-board-member')
  async removeBoardMember(
    @Body() data: { boardId: number; memberEmail: string },
    @Req() req: AuthRequest,
  ) {
    return this.BoardsService.removeMemberFromBoard(
      data.boardId,
      data.memberEmail,
      req.user.email,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/core-service/boards/get-board-members/:boardId')
  async getBoardMembers(@Param('boardId') boardId: string) {
    return this.BoardsService.getBoardMembers(Number(boardId));
  }
}
