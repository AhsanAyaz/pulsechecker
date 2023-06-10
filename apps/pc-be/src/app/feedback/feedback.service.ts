import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Feedback } from '@prisma/client';

@Injectable()
export class FeedbackService {

  constructor(private readonly prisma: PrismaService) {}
  create(createFeedbackDto: CreateFeedbackDto) {
    const {attendeeId, sessionId, pace, comment} = createFeedbackDto.feedback;
    const update: Partial<Feedback> = {};
    if (comment !== undefined) {
      update.comment = comment;
    }
    if (pace) {
      update.pace = pace;
    }
    return this.prisma.feedback.upsert({
      where: {
        sessionId_attendeeId: {
          attendeeId,
          sessionId
        }
      },
      create: createFeedbackDto.feedback,
      update
    });
  }

  findAll(sessionId: number) {
    return this.prisma.feedback.groupBy({
      by: ['pace'],
      where: {
        sessionId
      },
      _count: {
        pace: true
      }
    });
  }

  findOne(sessionId: number, attendeeId: number) {
    return this.prisma.feedback.findUnique({
      where: {
        sessionId_attendeeId: {
          sessionId,
          attendeeId
        }
      }
    });
  }

  update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    return `This action updates a #${id} feedback`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
