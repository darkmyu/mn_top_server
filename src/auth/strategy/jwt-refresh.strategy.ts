import { AuthService } from '@/auth/auth.service';
import { EnvironmentVariables } from '@/common/interface/config.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interface/auth.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_SECRET', { infer: true }),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.findUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
