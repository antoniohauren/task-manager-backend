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
import { CreateTaskDto, UpdateTaskDto, UpdateTaskStatusDto } from './dto';
import { TaskService } from './task.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: UserJwt) {
    return this.taskService.create(createTaskDto, user.id);
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
