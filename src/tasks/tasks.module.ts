import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsModule } from 'src/boards/boards.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), BoardsModule],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
