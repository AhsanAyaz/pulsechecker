import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JoinSessionDto } from '../sessions/dto/join-session.dto';
import { CreateReactionsCountDto } from './dto/create-reactions-count.dto';
import { UpdateReactionsCountDto } from './dto/update-reactions-count.dto';

@Injectable()
export class ReactionsCountService {
  constructor(private prisma: PrismaService) {}

  async create(createReactionsCountDto: CreateReactionsCountDto) {
    const {sessionId, reactionType, count} = createReactionsCountDto;
    const session = await this.prisma.reactionCount.findFirst({
      where: {
        sessionId,
        reactionType
      }
    }) 
    return this.prisma.reactionCount.upsert({
      where: { sessionId_reactionType: {
        sessionId,
        reactionType
      }},
      update: {
        ...createReactionsCountDto,
        count: (session?.count || 0) + count
      },
      create: createReactionsCountDto
    });
  }

  join(joinSessionDto: JoinSessionDto, pin: string) {
    return Promise.resolve({success: true, joinSessionDto, pin});
  }

  findAll() {
    return `This action returns all reactionsCount`;
  }

  findOne(id: number) {
    return this.prisma.reactionCount.findFirst();
  }

  findBySessionId(sessionId: number) {
    return this.prisma.reactionCount.findMany({
      where: {
        sessionId
      }
    });
  }

  update(id: number, updateReactionsCountDto: UpdateReactionsCountDto) {
    return `This action updates a #${id} reactionsCount`;
  }

  remove(id: number) {
    return `This action removes a #${id} reactionsCount`;
  }
}
