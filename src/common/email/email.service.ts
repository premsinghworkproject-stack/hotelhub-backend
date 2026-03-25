import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailTemplatesService } from './email-templates.service';

export enum EmailTemplateType {
  OTP = 'OTP',
  WELCOME = 'WELCOME',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

export interface EmailData {
  to: string;
  templateType: EmailTemplateType;
  context: Record<string, any>;
}

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly emailTemplatesService: EmailTemplatesService,
  ) {}

  /**
   * Send email using template type and context data
   * 
   * @param emailData - Email data including recipient, template type, and context
   * @returns Promise<void>
   */
  async sendEmailTemplate(emailData: EmailData): Promise<void> {
    try {
      const { to, templateType, context } = emailData;
      
      // Generate template based on type and context
      const template = this.emailTemplatesService.generateTemplate(templateType, context);

      await this.mailerService.sendMail({
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      
      console.log(`Email sent successfully to: ${to} using template: ${templateType}`);
    } catch (error) {
      console.error(`Failed to send email to ${emailData.to}:`, error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
