import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReactionsCountDto } from './dto/create-reactions-count.dto';
import { UpdateReactionsCountDto } from './dto/update-reactions-count.dto';

@Injectable()
export class ReactionsCountService {
  constructor(private prisma: PrismaService) {}

  create(createReactionsCountDto: CreateReactionsCountDto) {
    const {sessionId, userId, reactionType} = createReactionsCountDto;
    return this.prisma.reactionCount.upsert({
      where: { userId_sessionId_reactionType: {
        userId,
        sessionId,
        reactionType
      }},
      update: {
        ...createReactionsCountDto
      },
      create: createReactionsCountDto
    });
  }

  findAll() {
    return `This action returns all reactionsCount`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reactionsCount`;
  }

  update(id: number, updateReactionsCountDto: UpdateReactionsCountDto) {
    return `This action updates a #${id} reactionsCount`;
  }

  remove(id: number) {
    return `This action removes a #${id} reactionsCount`;
  }
}
