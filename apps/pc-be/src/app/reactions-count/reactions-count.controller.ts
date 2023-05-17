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
import { ReactionsCountService } from './reactions-count.service';
import { CreateReactionsCountDto } from './dto/create-reactions-count.dto';
import { UpdateReactionsCountDto } from './dto/update-reactions-count.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('reactions-count')
export class ReactionsCountController {
  constructor(private readonly reactionsCountService: ReactionsCountService) {}
  
  @Throttle(20, 60)
  @Post()
  create(@Body() createReactionsCountDto: CreateReactionsCountDto) {
    return this.reactionsCountService.create(createReactionsCountDto);
  }

  @Throttle(20, 60)
  @Get()
  findAll(@Query('sessionId') sessionId: string) {
    if (!sessionId) {
      return this.reactionsCountService.findAll();
    }
    return this.reactionsCountService.findBySessionId(Number(sessionId));
  }

  @Throttle(20, 60)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reactionsCountService.findOne(+id);
  }

  @Throttle(20, 60)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReactionsCountDto: UpdateReactionsCountDto
  ) {
    return this.reactionsCountService.update(+id, updateReactionsCountDto);
  }

  @Throttle(5, 60)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reactionsCountService.remove(+id);
  }
}
