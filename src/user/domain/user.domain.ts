import { Exclude } from 'class-transformer';
import { User, Task } from '@prisma/client';

export class UserDomain implements User {
  id: string;
  email: string;
  name: string;
  refreshToken: string;
  tasks?: Task[];

  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  hashPassword: string;

  constructor(partial: Partial<UserDomain>) {
    Object.assign(this, partial);
  }
}
