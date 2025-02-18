import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { NotificationConfig } from '../notification.config';
@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private notificationConfig: NotificationConfig,
  ) {}
  async sendConfirmationEmail(
    emailAddress: string,
    login: string,
    confirmCode: string,
  ) {
    await this.mailerService.sendMail({
      from: `"Bloggers Platform 👻" <${this.notificationConfig.emailSenderAddress}>`,
      to: emailAddress,
      subject: 'Email Confirmation',
      html: `<h1>Hi ${login}! Thanks for your registration</h1>
    <p>To finish registration please follow the link below:
    <a href=${this.notificationConfig.productionUrl}/confirm-registration?code=${confirmCode}>
     Complete registration!</a></p>`,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
      },
    });
  }
  async sendPasswordRecovery(
    emailAddress: string,
    login: string,
    recoveryCode: string,
  ) {
    await this.mailerService.sendMail({
      from: `"Bloggers Platform 👻" <${this.notificationConfig.emailSenderAddress}>`,
      to: emailAddress,
      subject: 'Password Recovery',
      html: `<h1>Hi ${login}!</h1>
    <p>To finish password recovery please follow the link below:
    <a href=${this.notificationConfig.productionUrl}/password-recovery?code=${recoveryCode}>
     Complete registration!</a></p>`,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
      },
    });
  }
}
