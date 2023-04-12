import { Attendee } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class JoinSessionDto {
  @IsNotEmpty()
  attendee: Attendee;
}
