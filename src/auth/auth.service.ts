import { UserService } from '@/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './domain/user-payload';
import { SignInDto, SignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findOneByEmail(signInDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.userService.validatePassword(
      signInDto.password,
      user.hashPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: UserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const tokens = await this.generateTokens(payload);

    this.userService.setRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async signUp(signUpDto: SignUpDto) {
    const createdUser = await this.userService.create(signUpDto);

    const payload: UserPayload = {
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
    };

    const tokens = await this.generateTokens(payload);

    this.userService.setRefreshToken(createdUser.id, tokens.refreshToken);

    return tokens;
  }

  private async generateTokens(userPayload: UserPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(userPayload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(userPayload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
