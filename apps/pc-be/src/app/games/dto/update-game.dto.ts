import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateGameDto } from './create-game.dto';

export class UpdateGameDto extends PartialType(CreateGameDto) {
  @IsOptional()
  pin: string;
}
