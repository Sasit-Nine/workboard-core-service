import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './boards.entity';
import { BoardMember } from './boards-member.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, BoardMember]),
    HttpModule,
    ConfigModule,
  ],
  providers: [BoardsService],
  exports: [BoardsService],
})
export class BoardsModule {}
