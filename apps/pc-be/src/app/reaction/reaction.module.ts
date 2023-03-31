import { Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  controllers: [ReactionController],
  providers: [ReactionService],
  imports: [PrismaModule],
  exports: [ReactionService]
})
export class ReactionModule {}
