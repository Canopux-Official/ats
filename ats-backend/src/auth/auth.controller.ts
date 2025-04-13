import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Make the error signup with same email
  @Post('signup')
  async signup(@Body() body) {
    return this.authService.signup(body.email, body.password, body.role);
  }

  @Post('login')
  async login(@Body() body) {
    return this.authService.login(body.email, body.password);
  }
}
