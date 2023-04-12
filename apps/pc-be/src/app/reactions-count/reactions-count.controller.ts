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

@Controller('reactions-count')
export class ReactionsCountController {
  constructor(private readonly reactionsCountService: ReactionsCountService) {}

  @Post()
  create(@Body() createReactionsCountDto: CreateReactionsCountDto) {
    return this.reactionsCountService.create(createReactionsCountDto);
  }

  @Get()
  findAll(@Query('sessionId') sessionId: string) {
    if (!sessionId) {
      return this.reactionsCountService.findAll();
    }
    return this.reactionsCountService.findBySessionId(Number(sessionId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reactionsCountService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReactionsCountDto: UpdateReactionsCountDto
  ) {
    return this.reactionsCountService.update(+id, updateReactionsCountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reactionsCountService.remove(+id);
  }
}
