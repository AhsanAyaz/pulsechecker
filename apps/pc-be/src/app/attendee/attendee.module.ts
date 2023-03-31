import { Module } from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { AttendeeController } from './attendee.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  controllers: [AttendeeController],
  providers: [AttendeeService],
  imports: [PrismaModule]
})
export class AttendeeModule {}
