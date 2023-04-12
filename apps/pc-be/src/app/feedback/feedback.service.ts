import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FeedbackService {

  constructor(private readonly prisma: PrismaService) {}
  create(createFeedbackDto: CreateFeedbackDto) {
    const {attendeeId, sessionId} = createFeedbackDto.feedback;
    return this.prisma.feedback.upsert({
      where: {
        sessionId_attendeeId: {
          attendeeId,
          sessionId
        }
      },
      create: createFeedbackDto.feedback,
      update: {
        pace: createFeedbackDto.feedback.pace
      }
    });
  }

  findAll() {
    return `This action returns all feedback`;
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
