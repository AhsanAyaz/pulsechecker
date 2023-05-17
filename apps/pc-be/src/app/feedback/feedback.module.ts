import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
  imports: [PrismaModule, ThrottlerModule],
  exports: [FeedbackService]
})
export class FeedbackModule {}
