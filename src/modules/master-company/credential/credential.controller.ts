import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CredentialsService } from './credential.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.credentialsService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.credentialsService.login(loginDto);
  }
}
