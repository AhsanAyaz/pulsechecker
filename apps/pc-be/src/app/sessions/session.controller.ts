import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SessionsService } from './session.service';
import { ReactionsCountService } from '../reactions-count/reactions-count.service';
import { CreateReactionsCountDto } from '../reactions-count/dto/create-reactions-count.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { JoinSessionDto } from './dto/join-session.dto';
import { CreateFeedbackDto } from '../feedback/dto/create-feedback.dto';
import { FeedbackService } from '../feedback/feedback.service';
import { Throttle } from '@nestjs/throttler';

@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly sessionService: SessionsService, 
    private readonly rcService: ReactionsCountService,
    private readonly feedbackService: FeedbackService,
  ) {}

  @Throttle(3, 60)
  @Post()
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionService.create(createSessionDto);
  }

  @Throttle(20, 60)
  @Get(':id')
  findOne(@Param('id') id: string, @Query('withFeedback') withFeedback: boolean) {
    return this.sessionService.findOne(Number(id), withFeedback);
  }
  
  @Throttle(20, 60)
  @Get('by-pin/:pin')
  findByPin(@Param('pin') pin: string) {
    return this.sessionService.findByPin(pin);
  }

  @Post(':id/reaction')
  updateReactions(@Param('id') id: string, @Body() createRCDto: CreateReactionsCountDto) {
    return this.rcService.create({
      ...createRCDto,
      sessionId: +id
    });
  }
  
  @Throttle(20, 60)
  @Get(':id/feedback/:attendeeId')
  getSessionFeedbackByAttendee(@Param('id') id: string, @Param('attendeeId') attendeeId: string) {
    return this.feedbackService.findOne(Number(id), Number(attendeeId));
  }

  @Throttle(20, 60)
  @Get(':id/feedback')
  getSessionFeedbacks(@Param('id') id: string) {
    return this.feedbackService.findAll(Number(id));
  }

  @Throttle(10, 60)
  @Post(':id/feedback')
  saveSessionFeedback(@Param('id') id: string, @Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create({
      ...createFeedbackDto
    });
  }

  @Throttle(10, 60)
  @Post(':pin/join')
  joinSession(@Param('pin') pin: string, @Body() joinSessionDto: JoinSessionDto) {
    return this.sessionService.joinSession(pin, joinSessionDto);
  }

  @Throttle(10, 60)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionService.update(+id, updateSessionDto);
  }

  @Throttle(10, 60)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionService.remove(+id);
  }
}
