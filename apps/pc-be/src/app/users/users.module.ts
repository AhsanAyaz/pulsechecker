import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { SessionsModule } from '../sessions/session.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule, SessionsModule]
})
export class UsersModule {}
