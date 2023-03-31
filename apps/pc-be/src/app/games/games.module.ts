import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ReactionsCountModule } from '../reactions-count/reactions-count.module';

@Module({
  controllers: [GamesController],
  providers: [GamesService],
  imports: [PrismaModule, ReactionsCountModule]
})
export class GamesModule {}
