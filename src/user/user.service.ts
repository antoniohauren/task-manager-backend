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

    const hashPassword = bcrypt.hashSync(createUserDto.password, 10);

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
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
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

  async findOneByEmail(email: string): Promise<UserDomain> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async validatePassword(password: string, hashPassword: string) {
    return bcrypt.compareSync(password, hashPassword);
  }

  async setRefreshToken(id: string, refreshToken: string) {
    const hash = bcrypt.hashSync(refreshToken, 10);

    await this.prisma.user.update({
      where: { id },
      data: { refreshToken: hash },
    });
  }

  async removeRefreshToken(id: string) {
    await this.prisma.user.updateMany({
      where: { id, refreshToken: { not: null } },
      data: { refreshToken: null },
    });
  }
}
