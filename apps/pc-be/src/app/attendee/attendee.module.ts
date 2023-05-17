import { Module } from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { AttendeeController } from './attendee.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  controllers: [AttendeeController],
  providers: [AttendeeService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
  imports: [PrismaModule, ThrottlerModule]
})
export class AttendeeModule {}
