import { AppConfigService } from '@/config/app-config.service';
import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { CookieOptions, Response } from 'express';
import { AuthService } from './auth.service';
import { GetUser } from './decorator/get-user.decorator';
import { Public } from './decorator/public.decorator';
import { RegisterRequestDto } from './dto/register-request.dto';
import { OAuthUser } from './interface/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly appConfigService: AppConfigService,
  ) {}

  @Public()
  @Post('register')
  @UseGuards(AuthGuard('jwt-register'))
  async register(@GetUser() oauthUser: OAuthUser, @Body() body: RegisterRequestDto, @Res() res: Response) {
    const user = await this.authService.register(oauthUser, body);
    const { accessToken, refreshToken } = await this.authService.generateTokens({
      id: user.id,
      username: user.username,
    });

    this.setTokenCookie(res, 'access_token', accessToken, {
      maxAge: 60 * 60 * 1000,
    });

    this.setTokenCookie(res, 'refresh_token', refreshToken, {
      maxAge: 60 * 60 * 1000 * 24 * 7,
    });

    return res.send(user);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async google() {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@GetUser() user: User | OAuthUser, @Res() res: Response) {
    return this.handleSocialCallback(user, res);
  }

  @Public()
  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naver() {}

  @Public()
  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverCallback(@GetUser() user: User | OAuthUser, @Res() res: Response) {
    return this.handleSocialCallback(user, res);
  }

  @Public()
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakao() {}

  @Public()
  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(@GetUser() user: User | OAuthUser, @Res() res: Response) {
    return this.handleSocialCallback(user, res);
  }

  private async handleSocialCallback(user: User | OAuthUser, res: Response) {
    const host = this.appConfigService.host;

    if ('id' in user) {
      const { accessToken, refreshToken } = await this.authService.generateTokens({
        id: user.id,
        username: user.username,
      });

      this.setTokenCookie(res, 'access_token', accessToken, {
        maxAge: 60 * 60 * 1000,
      });

      this.setTokenCookie(res, 'refresh_token', refreshToken, {
        maxAge: 60 * 60 * 1000 * 24 * 7,
      });

      return res.redirect(host);
    }

    const registerToken = await this.authService.generateRegisterToken(user);

    this.setTokenCookie(res, 'register_token', registerToken, {
      maxAge: 60 * 60 * 1000,
    });

    return res.redirect(`${host}/onboarding`);
  }

  private setTokenCookie(res: Response, name: string, token: string, options: CookieOptions) {
    res.cookie(name, token, {
      httpOnly: true,
      domain: this.appConfigService.domain,
      ...options,
    });
  }
}
