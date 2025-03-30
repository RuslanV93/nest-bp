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
    try {
      await this.mailerService.sendMail({
        from: `"Bloggers Platform 👻" <${this.notificationConfig.emailSenderAddress}>`,
        to: emailAddress,
        subject: 'Registration',
        html: `<h1>Hi ${login}! Thanks for your registration</h1>
    <p>To finish registration please follow the link below:
    ${this.notificationConfig.productionUrl}/confirm-registration?code=${confirmCode} 
    <a href=${this.notificationConfig.productionUrl}/confirm-registration?code=${confirmCode}>
     Complete registration!</a></p>`,
        headers: {
          'Content-Type': 'text/html; charset=UTF-8',
        },
      });
      return true;
    } catch (e) {
      console.log(e + 'from nodemailer reg');
      throw new Error('Failed to send confirmation email');
    }
  }
  resendConfirmationEmail(
    emailAddress: string,
    login: string,
    confirmCode: string,
  ) {
    try {
      console.log(emailAddress + 'resend');
      this.mailerService.sendMail({
        from: `"Bloggers Platform 👻" <${this.notificationConfig.emailSenderAddress}>`,
        to: emailAddress,
        subject: 'Registration',
        html: `<h1>Hi ${login}!</h1>
    <p>To finish registration please follow the link below:
    ${this.notificationConfig.productionUrl}/confirm-registration?code=${confirmCode}
    <a href=${this.notificationConfig.productionUrl}/confirm-registration?code=${confirmCode}>
     Complete registration!</a></p>`,
        headers: {
          'Content-Type': 'text/html; charset=UTF-8',
        },
      });
      return true;
    } catch (e) {
      console.log(e + 'from nodemailer resend');
      throw new Error('Failed to send confirmation email');
    }
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
    ${this.notificationConfig.productionUrl}/password-recovery?code=${recoveryCode} 
    <a href=${this.notificationConfig.productionUrl}/password-recovery?code=${recoveryCode}>
     Complete registration!</a></p>`,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
      },
    });
  }
}
