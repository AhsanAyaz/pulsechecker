import { IsNotEmpty } from "class-validator";

export class CreateReactionDto {
  
  @IsNotEmpty()
  type: string;

}
