import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser, Public } from './decorator';
import { SignInDto, SignUpDto } from './dto';
import { RefreshTokenGuard } from './guard';
import { UserJwt } from './domain/user-jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() signUp: SignUpDto) {
    return this.authService.signUp(signUp);
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  signOut(@CurrentUser() user: UserJwt) {
    return this.authService.signOut(user.id);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@CurrentUser() user: UserJwt) {
    return this.authService.refresh(user.id, user.refreshToken);
  }
}
