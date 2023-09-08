import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.CREATED)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.OK)
  signUp(@Body() signUp: SignUpDto) {
    return this.authService.signUp(signUp);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  signOut(@Req() req: Request) {
    const user = req.user;

    return this.authService.signOut(user['id']);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Req() req: Request) {
    const user = req.user;

    return this.authService.refresh(user['id'], user['refreshToken']);
  }
}
