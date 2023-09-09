import { CurrentUser } from '@/auth/decorator';
import { UserJwt } from '@/auth/domain/user-jwt';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UpdateTaskDto } from './dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    console.log(createTaskDto);
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAllByUser(@CurrentUser() user: UserJwt) {
    return this.taskService.findAllByUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: UserJwt) {
    return this.taskService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: UserJwt,
  ) {
    return this.taskService.update(id, updateTaskDto, user.id);
  }

  @Patch('/status/:id')
  updateStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @CurrentUser() user: UserJwt,
  ) {
    return this.taskService.updateStatus(id, updateTaskStatusDto, user.id);
  }

  @Patch('/archive/:id/')
  archiveTask(@Param('id') id: string, @CurrentUser() user: UserJwt) {
    return this.taskService.archiveTask(id, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: UserJwt) {
    return this.taskService.remove(id, user.id);
  }
}
