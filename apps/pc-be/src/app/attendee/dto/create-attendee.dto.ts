import { IsNotEmpty } from "class-validator";

export class CreateAttendeeDto {
  @IsNotEmpty()
  displayName: string;
}
