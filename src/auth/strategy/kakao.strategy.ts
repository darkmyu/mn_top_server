import { EnvironmentVariables } from '@/common/interface/config.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Provider } from '@prisma/client';
import { Profile, Strategy } from 'passport-kakao';
import { AuthService } from '../auth.service';
import { OAuthUser } from '../interface/auth.interface';

interface KakaoProfile extends Profile {
  _json: {
    id: number;
    properties: {
      profile_image: string;
    };
  };
}

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {
    super({
      clientID: configService.get('KAKAO_CLIENT_ID', { infer: true }),
      clientSecret: configService.get('KAKAO_CLIENT_SECRET', { infer: true }),
      callbackURL: configService.get('KAKAO_CALLBACK_URL', { infer: true }),
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: KakaoProfile) {
    const { id, properties } = profile._json;

    const oauthUser: OAuthUser = {
      provider: Provider.KAKAO,
      providerId: id.toString(),
      profileImage: properties.profile_image,
    };

    const user = await this.authService.validateOAuthUser(oauthUser);
    return user;
  }
}
