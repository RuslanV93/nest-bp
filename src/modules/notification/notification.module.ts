import { EmailService } from './application/email.service';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import {
  EMAIL_PASS_CODE,
  EMAIL_SENDER_ADDRESS,
} from '../../shared/constants/settings';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: `smtp://ruslanvak411@gmail.com:${EMAIL_PASS_CODE}@smtp.gmail.com`,
      defaults: { from: `"Bloggers Platform 👻" <${EMAIL_SENDER_ADDRESS}>` },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class NotificationModule {}
