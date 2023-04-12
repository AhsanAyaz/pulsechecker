import { IsNotEmpty } from "class-validator";
import { Feedback } from '@prisma/client';
export class CreateFeedbackDto {
  @IsNotEmpty()
  feedback: Feedback
}
