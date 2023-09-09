import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto, UpdateTaskStatusDto } from './dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: createTaskDto,
    });
  }

  findAllByUser(userId: string) {
    return this.prisma.task.findMany({
      where: {
        userId,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const taskToUpdate = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!taskToUpdate) {
      throw new NotFoundException('Task not found');
    }

    if (taskToUpdate.userId !== userId) {
      throw new ForbiddenException('You are not allowed to update this task');
    }

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async updateStatus(
    id: string,
    updateTaskDto: UpdateTaskStatusDto,
    userId: string,
  ) {
    const taskToUpdate = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!taskToUpdate) {
      throw new NotFoundException('Task not found');
    }

    if (taskToUpdate.userId !== userId) {
      throw new ForbiddenException('You are not allowed to update this task');
    }

    const oldTaskStatus = taskToUpdate.status;
    const newTaskStatus = updateTaskDto.status;

    if (oldTaskStatus === newTaskStatus) {
      throw new BadRequestException('Task status is already the same');
    }

    if (newTaskStatus === 'ARCHIVED') {
      throw new BadRequestException(
        'You are not allowed to archive tasks on this endpoint',
      );
    }

    if (oldTaskStatus === 'DONE' || oldTaskStatus === 'ARCHIVED') {
      throw new BadRequestException(
        'You are not allowed to update tasks that are done or archived',
      );
    }

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async archiveTask(id: string, userId: string) {
    const taskToUpdate = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!taskToUpdate) {
      throw new NotFoundException('Task not found');
    }

    if (taskToUpdate.userId !== userId) {
      throw new ForbiddenException('You are not allowed to archive this task');
    }

    if (taskToUpdate.status === 'ARCHIVED') {
      throw new BadRequestException('Task already archived');
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        status: 'ARCHIVED',
      },
    });
  }

  async remove(id: string, userId: string) {
    const taskToDelete = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!taskToDelete) {
      throw new NotFoundException('Task not found');
    }

    if (taskToDelete.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this task');
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
