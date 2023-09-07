import { Prisma } from '@prisma/client';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto
  implements Omit<Prisma.UserCreateInput, 'hashPassword'>
{
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;
}
