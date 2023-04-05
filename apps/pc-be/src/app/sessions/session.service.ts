import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}
  async create(createSessionDto: CreateSessionDto) {
    try {
      return await this.prisma.session.create({
        data: createSessionDto
      })
    } catch (e) {
      console.log({e})
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e.code)
        // The .code property can be accessed in a type-safe manner
        switch (e.code) {
          case 'P2002':
            throw new HttpException('Session with unique pin already created', HttpStatus.BAD_REQUEST);
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

  async findOne(id: number) {
    const session = await this.prisma.session.findFirst({where: {
      id
    }});
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    return session;
  }

  update(id: number, updateSessionDto: UpdateSessionDto) {
    return this.prisma.session.update({
      data: updateSessionDto,
      where: {
        id
      }
    });
  }

  remove(id: number) {
    return `This action removes a #${id} session`;
  }
}
