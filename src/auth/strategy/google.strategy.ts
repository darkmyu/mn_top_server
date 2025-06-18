import { AuthService } from '@/auth/auth.service';
import { OAuthUser } from '@/auth/interface/auth.interface';
import { EnvironmentVariables } from '@/common/interface/config.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Provider, User } from '@prisma/client';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID', { infer: true }),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET', { infer: true }),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL', { infer: true }),
      scope: ['email', 'profile'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<User> {
    const { id, name, emails, photos } = profile;

    const oauthUser: OAuthUser = {
      email: emails![0].value,
      username: name!.givenName,
      provider: Provider.GOOGLE,
      providerId: id,
      profileImage: photos![0].value,
    };

    const user = await this.authService.validateOAuthUser(oauthUser);
    return user;
  }
}
