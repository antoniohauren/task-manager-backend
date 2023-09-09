import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto';
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

  findOne(id: string) {
    return `This action returns a #${id} task`;
  }

  // update(id: string, updateTaskDto: UpdateTaskDto) {
  //   return `This action updates a #${id} task`;
  // }

  remove(id: string) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
