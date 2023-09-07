import { Exclude } from 'class-transformer';
import { User } from '@prisma/client';

export class UserDomain implements User {
  id: string;
  email: string;
  name: string;
  refreshToken: string;

  @Exclude()
  hashPassword: string;

  constructor(partial: Partial<UserDomain>) {
    Object.assign(this, partial);
  }
}
