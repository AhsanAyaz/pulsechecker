import { IsNotEmpty } from "class-validator";

export class CreateSessionDto {
  @IsNotEmpty()
  name: string;
  
  @IsNotEmpty()
  userId: string;
}
