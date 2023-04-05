import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SessionsService } from './session.service';
import { ReactionsCountService } from '../reactions-count/reactions-count.service';
import { CreateReactionsCountDto } from '../reactions-count/dto/create-reactions-count.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { JoinSessionDto } from './dto/join-session.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionService: SessionsService, private readonly rcService: ReactionsCountService) {}

  @Post()
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionService.create(createSessionDto);
  }

  @Get()
  findAll() {
    return this.sessionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionService.findOne(Number(id));
  }

  @Post(':id/reaction')
  updateReactions(@Param('id') id: string, @Body() createRCDto: CreateReactionsCountDto) {
    return this.rcService.create({
      ...createRCDto,
      sessionId: +id
    });
  }

  @Post(':pin/join')
  joinSession(@Param('pin') pin: string, @Body() joinSessionDto: JoinSessionDto) {
    return this.rcService.join(joinSessionDto, pin);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionService.update(+id, updateSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionService.remove(+id);
  }
}
