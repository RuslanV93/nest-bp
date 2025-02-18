import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { configValidationUtility } from '../../shared/utils/config-validation-utility';

@Injectable()
export class NotificationConfig {
  emailSenderAddress: string = this.configService.getOrThrow(
    'EMAIL_SENDER_ADDRESS',
  );
  emailPassCode: string = this.configService.getOrThrow('EMAIL_PASS_CODE');
  productionUrl: string = this.configService.getOrThrow('WEBSITE_URL');

  constructor(private readonly configService: ConfigService) {
    configValidationUtility.validateConfig(this);
  }
}
