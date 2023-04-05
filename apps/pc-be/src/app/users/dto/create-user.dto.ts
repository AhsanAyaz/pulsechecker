import { AuthProvider } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";


export class CreateUserDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  displayName: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  providerId: string;
  
  @IsEnum(AuthProvider)
  authProvider: AuthProvider;
}
