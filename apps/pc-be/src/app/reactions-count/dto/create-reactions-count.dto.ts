import { IsNotEmpty, IsOptional, IsPositive } from "class-validator";

export class CreateReactionsCountDto {
  @IsOptional()
  sessionId: number;

  @IsNotEmpty()
  reactionType: string;

  @IsPositive()
  count: number;
}
