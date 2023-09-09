import { $Enums, Task, User } from '@prisma/client';

export class TaskDomain implements Task {
  id: string;
  title: string;
  description: string;
  status: $Enums.TaskStatus;

  user?: User;
  userId: string;

  createdAt: Date;
  updatedAt: Date;
}
