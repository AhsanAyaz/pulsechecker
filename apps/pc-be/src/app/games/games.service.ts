import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}
  async create(createGameDto: CreateGameDto) {
    try {
      return await this.prisma.session.create({
        data: createGameDto
      })
    } catch (e) {
      console.log({e})
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e.code)
        // The .code property can be accessed in a type-safe manner
        switch (e.code) {
          case 'P2002':
            throw new HttpException('Game with unique pin already created', HttpStatus.BAD_REQUEST);
          case 'p2003':
            throw new HttpException('User with provided ID does not exist', HttpStatus.BAD_REQUEST);
        }
      }
      throw e
    };
  }

  findAll() {
    return this.prisma.session.findMany({});
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return this.prisma.session.update({
      data: updateGameDto,
      where: {
        id
      }
    });
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
