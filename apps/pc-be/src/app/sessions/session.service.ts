import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { JoinSessionDto } from './dto/join-session.dto';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}
  async create(createSessionDto: CreateSessionDto) {
    try {
      return await this.prisma.session.create({
        data: {
          ...createSessionDto,
          pin: nanoid(5),
        },
      });
    } catch (e) {
      console.log({ e });
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e.code);
        // The .code property can be accessed in a type-safe manner
        switch (e.code) {
          case 'P2002':
            throw new HttpException(
              'Session with unique pin already created',
              HttpStatus.BAD_REQUEST
            );
          case 'p2003':
            throw new HttpException(
              'User with provided ID does not exist',
              HttpStatus.BAD_REQUEST
            );
        }
      }
      throw e;
    }
  }

  getUserSessions(userId: string) {
    return this.prisma.session.findMany({
      where: {
        userId,
      },
    });
  }

  deleteUserSession(sessionId: number) {
    return this.prisma.session.delete({
      where: {
        id: sessionId,
      },
    });
  }

  async findOne(id: number, withFeedback = false) {
    const session = await this.prisma.session.findFirst({
      where: {
        id,
      },
      include: {
        Feedback: {
          include: {
            attendee: withFeedback
          }
        },
      },
    });
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    return session;
  }

  async findByPin(pin: string) {
    const session = await this.prisma.session.findFirst({
      where: {
        pin,
      },
    });
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    return session;
  }

  async joinSession(pin: string, joinSessionDto: JoinSessionDto) {
    const session = await this.prisma.session.findFirst({
      where: { pin },
    });
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    const attendee = await this.prisma.attendee.upsert({
      where: {
        id: joinSessionDto.attendee.id || -1,
      },
      update: {
        displayName: joinSessionDto.attendee.displayName,
        sessions: {
          connect: {
            id: session.id,
          },
        },
      },
      create: {
        displayName: joinSessionDto.attendee.displayName,
        sessions: {
          connect: {
            id: session.id,
          },
        },
      },
    });

    return {
      attendee,
    };
  }

  update(id: number, updateSessionDto: UpdateSessionDto) {
    return this.prisma.session.update({
      data: updateSessionDto,
      where: {
        id,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} session`;
  }
}
