import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  displayName: string;
}
