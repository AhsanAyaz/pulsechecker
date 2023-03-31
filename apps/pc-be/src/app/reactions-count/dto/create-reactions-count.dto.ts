import { IsNotEmpty, IsOptional, IsPositive } from "class-validator";

export class CreateReactionsCountDto {
  @IsNotEmpty()
  userId: number;

  @IsOptional()
  sessionId: number;

  @IsNotEmpty()
  reactionType: string;

  @IsPositive()
  count: number;
}
