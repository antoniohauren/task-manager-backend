import { PickType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PickType(CreateTaskDto, [
  'title',
  'description',
]) {}
