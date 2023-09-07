import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto';
import { PrismaService } from '@/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { UserDomain } from './domain/user.domain';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserDomain> {
    const user = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (user) {
      throw new ConflictException('Email already in use');
    }

    const hashPassword = bcrypt.hashSync('bob_password', 10);

    const createdUser = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        hashPassword,
      },
    });

    return new UserDomain(createdUser);
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<UserDomain> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return new UserDomain(user);
  }
}
