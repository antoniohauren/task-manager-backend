import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto, UpdateTaskStatusDto } from './dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTaskDto: CreateTaskDto, userId: string) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: 'TODO',
        userId,
      },
    });
  }

  async findAllByUser(userId: string) {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        description: true,
        title: true,
        status: true,
      },
    });

    const tasksByStatus: Record<string, (typeof tasks)[number][]> = {};

    tasks.forEach((task) => {
      if (!tasksByStatus[task.status]) {
        tasksByStatus[task.status] = [task];
      } else {
        tasksByStatus[task.status].push(task);
      }
    });

    return tasksByStatus;
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
