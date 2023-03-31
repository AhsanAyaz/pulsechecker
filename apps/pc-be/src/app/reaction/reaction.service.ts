import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';

@Injectable()
export class ReactionService {
  
  constructor(private prisma: PrismaService) {}

  create(createReactionDto: CreateReactionDto) {
    return this.prisma.reaction.create({
      data: createReactionDto
    });
  }

  findAll() {
    return this.prisma.reaction.findMany({});
  }

  findOne(id: number) {
    return `This action returns a #${id} reaction`;
  }

  update(id: number, updateReactionDto: UpdateReactionDto) {
    return `This action updates a #${id} reaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} reaction`;
  }
}
