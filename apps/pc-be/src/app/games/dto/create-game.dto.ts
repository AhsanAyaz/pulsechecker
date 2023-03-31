import { IsNotEmpty } from 'class-validator';
export class CreateGameDto {
  @IsNotEmpty()
  name: string;
  
  @IsNotEmpty()
  pin: string;
  
  @IsNotEmpty()
  userId: number;
}
