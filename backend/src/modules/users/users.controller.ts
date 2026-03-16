import { Body, Controller, Post } from '@nestjs/common';
import { GoogleLoginDto } from './dto/google-login.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() payload: RegisterUserDto) {
    return this.usersService.register(payload);
  }

  @Post('login')
  login(@Body() payload: LoginUserDto) {
    return this.usersService.login(payload);
  }

  @Post('google')
  google(@Body() payload: GoogleLoginDto) {
    return this.usersService.googleLogin(payload);
  }
}
