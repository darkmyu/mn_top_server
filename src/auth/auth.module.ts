import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategy/google.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [PassportModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
