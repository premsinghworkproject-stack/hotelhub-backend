import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { EmailTemplatesService } from './email-templates.service';

@Module({
  imports: [
    ConfigModule,
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        transport: {
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || '',
          },
        },
        defaults: {
          from: `"${process.env.EMAIL_FROM_NAME || 'Booking System'}" <${process.env.EMAIL_FROM_ADDRESS || 'noreply@yourdomain.com'}>`,
        },
      }),
    }),
  ],
  providers: [EmailService, EmailTemplatesService],
  exports: [EmailService, EmailTemplatesService],
})
export class EmailModule {}
