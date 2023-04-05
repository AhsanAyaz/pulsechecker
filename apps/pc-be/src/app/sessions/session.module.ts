import { Module } from '@nestjs/common';
import { SessionsService } from './session.service';
import { SessionsController } from './session.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ReactionsCountModule } from '../reactions-count/reactions-count.module';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService],
  imports: [PrismaModule, ReactionsCountModule]
})
export class SessionsModule {}
