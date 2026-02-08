import { Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardColumn } from './column.entity';
import { BoardsModule } from 'src/boards/boards.module';

@Module({
  imports: [TypeOrmModule.forFeature([BoardColumn]), BoardsModule],
  providers: [ColumnsService],
  exports: [ColumnsService],
})
export class ColumnsModule {}
