import { Module } from '@nestjs/common';
import { ReactionsCountService } from './reactions-count.service';
import { ReactionsCountController } from './reactions-count.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  controllers: [ReactionsCountController],
  providers: [ReactionsCountService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
  exports: [ReactionsCountService],
  imports: [PrismaModule, ThrottlerModule]
})
export class ReactionsCountModule {}
