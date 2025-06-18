import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { GetUser } from './decorator/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async google() {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@GetUser() user: User, @Res() res: Response) {
    // generate tokens
    // redirect to frontend with tokens
  }
}
