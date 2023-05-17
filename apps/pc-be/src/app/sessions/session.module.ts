import { Module } from '@nestjs/common';
import { SessionsService } from './session.service';
import { SessionsController } from './session.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ReactionsCountModule } from '../reactions-count/reactions-count.module';
import { FeedbackModule } from '../feedback/feedback.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
  imports: [PrismaModule, ReactionsCountModule, FeedbackModule, ThrottlerModule],
  exports: [SessionsService]
})
export class SessionsModule {}
