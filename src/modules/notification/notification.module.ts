import { EmailService } from './application/email.service';
import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { NotificationConfig } from './notification.config';
import { configModule } from '../../config-module';

@Global()
@Module({
  imports: [
    configModule,

    MailerModule.forRootAsync({
      useFactory: (notificationConfig: NotificationConfig) => {
        return {
          transport: `smtp://${notificationConfig.emailSenderAddress}:${notificationConfig.emailPassCode}@smtp.gmail.com`,
          defaults: {
            from: `"Bloggers Platform 👻" <${notificationConfig.emailSenderAddress}>`,
          },
        };
      },
      inject: [NotificationConfig],
    }),
    // MailerModule.forRootAsync({
    //   useFactory: (notificationConfig: NotificationConfig) => {
    //     return {
    //       transport: {
    //         host: 'smtp.yandex.ru',
    //         port: 465,
    //         secure: true,
    //         pool: true,
    //         auth: {
    //           user: notificationConfig.emailSenderAddress,
    //           pass: notificationConfig.emailPassCode,
    //         },
    //       },
    //       defaults: {
    //         from: `"Bloggers Platform 👻" <${notificationConfig.emailSenderAddress}>`,
    //       },
    //     };
    //   },
    //   inject: [NotificationConfig],
    // }),
  ],
  providers: [EmailService, NotificationConfig],
  exports: [EmailService, NotificationConfig],
})
export class NotificationModule {}
