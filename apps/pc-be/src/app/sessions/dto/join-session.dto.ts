import { IsNotEmpty } from "class-validator";

export class JoinSessionDto {
  @IsNotEmpty()
  attendeeName: string;
}
