import { PartialType } from '@nestjs/swagger';
import { CreateReactionsCountDto } from './create-reactions-count.dto';

export class UpdateReactionsCountDto extends PartialType(
  CreateReactionsCountDto
) {}
