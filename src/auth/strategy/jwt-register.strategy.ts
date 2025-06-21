import { EnvironmentVariables } from '@/config/interface/config.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { OAuthUser } from '../interface/auth.interface';

@Injectable()
export class JwtRegisterStrategy extends PassportStrategy(Strategy, 'jwt-register') {
  constructor(private readonly configService: ConfigService<EnvironmentVariables, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return req?.cookies?.['register_token'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REGISTER_SECRET', { infer: true }),
    });
  }

  validate(oauthUser: OAuthUser) {
    return oauthUser;
  }
}
