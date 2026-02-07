import { Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardColumn } from './column.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardColumn])],
  providers: [ColumnsService],
})
export class ColumnsModule {}
