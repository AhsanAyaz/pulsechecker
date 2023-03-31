import { Module } from '@nestjs/common';
import { ReactionsCountService } from './reactions-count.service';
import { ReactionsCountController } from './reactions-count.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  controllers: [ReactionsCountController],
  providers: [ReactionsCountService],
  exports: [ReactionsCountService],
  imports: [PrismaModule]
})
export class ReactionsCountModule {}
