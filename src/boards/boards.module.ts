import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './boards.entity';
import { BoardMember } from './boards-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardMember])],
  providers: [BoardsService],
})
export class BoardsModule {}
