import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateSessionDto } from './create-session.dto';


export class UpdateSessionDto extends PartialType(CreateSessionDto) {
  @IsOptional()
  pin: string;
}
