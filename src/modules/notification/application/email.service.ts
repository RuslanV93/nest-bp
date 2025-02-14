import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import {
  EMAIL_SENDER_ADDRESS,
  WEBSITE_URL,
} from '../../../shared/constants/settings';
@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}
  async sendConfirmationEmail(
    emailAddress: string,
    login: string,
    confirmCode: string,
  ) {
    await this.mailerService.sendMail({
      from: `"Bloggers Platform 👻" <${EMAIL_SENDER_ADDRESS}>`,
      to: emailAddress,
      subject: 'Email Confirmation',
      html: `<h1>Hi ${login}! Thanks for your registration</h1>
    <p>To finish registration please follow the link below:
    <a href=${WEBSITE_URL}/registration-confirmation/${confirmCode}>
     Complete registration!</a></p>`,
    });
  }
  async sendPasswordRecovery(
    emailAddress: string,
    login: string,
    recoveryCode: string,
  ) {
    await this.mailerService.sendMail({
      from: `"Bloggers Platform 👻" <${EMAIL_SENDER_ADDRESS}>`,
      to: emailAddress,
      subject: 'Password Recovery',
      html: `<h1>Hi ${login}!</h1>
    <p>To finish password recovery please follow the link below:
    <a href=${WEBSITE_URL}/registration-confirmation/${recoveryCode}>
     Complete registration!</a></p>`,
    });
  }
}
