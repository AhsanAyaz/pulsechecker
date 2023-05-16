import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';

@Injectable()
export class AttendeeService {
  constructor(private prisma: PrismaService) {}

  create(createAttendeeDto: CreateAttendeeDto) {
    return this.prisma.attendee.create({
      data: createAttendeeDto
    });
  }

  findAll() {
    return `This action returns all attendee`;
  }

  findOne(id: number) {
    return this.prisma.attendee.findFirst({
      where: {
        id
      }
    });;
  }

  update(id: number) {
    return `This action updates a #${id} attendee`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendee`;
  }
}
