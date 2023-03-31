import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ReactionsCountService } from '../reactions-count/reactions-count.service';
import { CreateReactionsCountDto } from '../reactions-count/dto/create-reactions-count.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService, private readonly rcService: ReactionsCountService) {}

  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(+id);
  }

  @Post(':id/reaction')
  updateReactions(@Param('id') id: string, @Body() createRCDto: CreateReactionsCountDto) {
    return this.rcService.create({
      ...createRCDto,
      sessionId: +id
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(+id, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gamesService.remove(+id);
  }
}
