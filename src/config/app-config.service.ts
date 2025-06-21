import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './interface/config.interface';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<EnvironmentVariables, true>) {}

  get host() {
    return this.configService.get('NODE_ENV', { infer: true }) === 'production'
      ? 'https://mntop.com'
      : 'http://localhost:3000';
  }

  get domain() {
    return this.configService.get('NODE_ENV', { infer: true }) === 'production' ? '.mntop.com' : 'localhost';
  }
}
