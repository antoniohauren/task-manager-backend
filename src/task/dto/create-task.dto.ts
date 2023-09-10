import { $Enums, Prisma } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class CreateTaskDto implements Omit<Prisma.TaskCreateInput, 'User'> {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  status: $Enums.TaskStatus;

  userId: string;
}
