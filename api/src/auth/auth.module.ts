import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { RolesGuard } from '../guards/role.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET
    }),
  ],
  providers: [JwtStrategy, RolesGuard],
  exports: [JwtStrategy, RolesGuard],
})
export class AuthModule {}