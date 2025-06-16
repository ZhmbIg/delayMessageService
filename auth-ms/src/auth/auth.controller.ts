import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { User } from './entities/user.entity';
import { LoginDTO } from './dto/login.dto';
import { TokenResponseDTO } from './dto/token-response.dto';
import * as jwt from 'jsonwebtoken';
import { RedisService } from 'src/redis/redis.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDTO): Promise<User> {
    return this.authService.register(dto);
  }

@Post('login')
async login(@Body() dto: LoginDTO): Promise<TokenResponseDTO> {
  return this.authService.validateUser(dto);
}


  @Post('refresh')
async refresh(@Body() { refreshToken }: { refreshToken: string }): Promise<TokenResponseDTO> {
  const payload = jwt.verify(refreshToken, `${process.env.JWT_REFRESH_SECRET}`) as { sub: string };
  const storedToken = await this.redisService.get(payload.sub);

  if (storedToken !== refreshToken) {
    throw new UnauthorizedException('Invalid refresh token');
  }

  return this.authService.generateTokens(payload.sub);
}

}
