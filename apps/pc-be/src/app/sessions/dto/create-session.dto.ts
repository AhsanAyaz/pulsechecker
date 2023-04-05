import { IsNotEmpty } from "class-validator";

export class CreateSessionDto {
  @IsNotEmpty()
  name: string;
  
  @IsNotEmpty()
  pin: string;
  
  @IsNotEmpty()
  userId: string;
}
