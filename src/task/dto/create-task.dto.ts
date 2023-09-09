import { $Enums, Prisma } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto implements Omit<Prisma.TaskCreateInput, 'User'> {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum($Enums.TaskStatus)
  status: $Enums.TaskStatus;

  @IsString()
  userId: string;
}
