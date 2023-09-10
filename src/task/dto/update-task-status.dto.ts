import { $Enums } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsEnum($Enums.TaskStatus)
  status: $Enums.TaskStatus;
}
