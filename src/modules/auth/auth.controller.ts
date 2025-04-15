import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import LoginDto from './dtos/login.dto';
import Public from 'src/decorators/Public.decorator';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);
    return {
      status: 'success',
      code: 200,
      message: 'Login successful',
      data,
    };
  }
}
