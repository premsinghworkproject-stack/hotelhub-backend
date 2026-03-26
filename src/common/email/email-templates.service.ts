import { Injectable } from '@nestjs/common';
import { EmailTemplateType } from './email.service';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

@Injectable()
export class EmailTemplatesService {
  /**
   * Generate email template based on type and context
   * 
   * @param templateType - Type of email template
   * @param context - Dynamic data for template generation
   * @returns Email template
   */
  generateTemplate(templateType: EmailTemplateType, context: Record<string, any>): EmailTemplate {
    switch (templateType) {
      case EmailTemplateType.OTP:
        return this.generateOTPTemplate(context as { otp: string; userName?: string });
      case EmailTemplateType.WELCOME:
        return this.generateWelcomeTemplate(context as { userName: string; userEmail: string });
      case EmailTemplateType.PASSWORD_RESET:
        return this.generatePasswordResetTemplate(context as { userName?: string });
      default:
        throw new Error(`Unknown email template type: ${templateType}`);
    }
  }

  /**
   * Generate OTP verification email template
   * 
   * @param context - Context containing otp and optional userName
   * @returns Email template
   */
  private generateOTPTemplate(context: { otp: string; userName?: string }): EmailTemplate {
    const { otp, userName } = context;
    const greeting = userName ? `Hi ${userName},` : 'Hi,';

    return {
      subject: 'Your OTP Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Verification</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f6f8; padding: 30px 15px; width: 100%;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); margin: 0 auto;">
                  <tr>
                    <td style="background-color: #007bff; height: 6px; font-size: 0; line-height: 0;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px; text-align: center;">
                      <div style="font-size: 28px; font-weight: 800; color: #1a1a1a; margin-bottom: 30px; letter-spacing: -0.5px;">Booking System</div>
                      <div style="color: #4a5568; font-size: 16px; line-height: 1.6; text-align: left; margin-bottom: 25px;">
                        ${greeting}<br><br>
                        Your One-Time Password (OTP) for account verification is:
                      </div>
                      <div style="background-color: #f0f7ff; border: 2px dashed #007bff; display: inline-block; color: #007bff; font-size: 32px; font-weight: bold; padding: 15px 30px; border-radius: 8px; margin: 10px 0 25px; letter-spacing: 5px;">${otp}</div>
                      <div style="color: #4a5568; font-size: 16px; line-height: 1.6; text-align: left;">
                        This OTP will expire in <strong style="color: #e53e3e;">10 minutes</strong>.<br>
                        Please do not share this code with anyone.
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="color: #718096; font-size: 13px; margin: 0 0 8px;">If you didn't request this OTP, please ignore this email.</p>
                      <p style="color: #718096; font-size: 13px; margin: 0;">For security reasons, please don't reply to this email.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
        ${greeting},
        
        Your One-Time Password (OTP) for account verification is: ${otp}
        
        This OTP will expire in 10 minutes.
        Please do not share this code with anyone.
        
        If you didn't request this OTP, please ignore this email.
        For security reasons, please don't reply to this email.
      `
    };
  }

  /**
   * Generate welcome email template
   * 
   * @param context - Context containing userName and userEmail
   * @returns Email template
   */
  private generateWelcomeTemplate(context: { userName: string; userEmail: string }): EmailTemplate {
    const { userName, userEmail } = context;

    return {
      subject: 'Welcome to Booking System',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f6f8; padding: 30px 15px; width: 100%;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); margin: 0 auto;">
                  <tr>
                    <td style="background-color: #28a745; height: 6px; font-size: 0; line-height: 0;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px; text-align: center;">
                      <div style="font-size: 28px; font-weight: 800; color: #1a1a1a; margin-bottom: 25px; letter-spacing: -0.5px;">Booking System</div>
                      <div style="font-size: 20px; font-weight: 600; color: #2d3748; margin-bottom: 25px;">
                        Welcome aboard, ${userName}! 🎉
                      </div>
                      
                      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: left;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #4a5568; width: 80px;">Name:</td>
                            <td style="padding: 8px 0; color: #2d3748;">${userName}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-weight: 600; color: #4a5568; width: 80px;">Email:</td>
                            <td style="padding: 8px 0; color: #2d3748;">${userEmail}</td>
                          </tr>
                        </table>
                      </div>
                      
                      <a href="#" style="display: inline-block; background-color: #28a745; color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 6px; font-weight: bold; font-size: 16px; margin-top: 10px; box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);">Get Started Now</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="color: #718096; font-size: 13px; margin: 0 0 8px;">Thank you for joining our platform!</p>
                      <p style="color: #718096; font-size: 13px; margin: 0;">If you have any questions, please contact our support team.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
        Welcome to Booking System, ${userName}! 🎉
        
        Your account details:
        Name: ${userName}
        Email: ${userEmail}
        
        Thank you for joining our platform!
        If you have any questions, please contact our support team.
      `
    };
  }

  /**
   * Generate password reset email template
   * 
   * @param context - Context containing resetToken and optional userName
   * @returns Email template
   */
  private generatePasswordResetTemplate(context: {  userName?: string }): EmailTemplate {
    const { userName } = context;
    const greeting = userName ? `Hi ${userName},` : 'Hi,';

    return {
      subject: 'Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f6f8; padding: 30px 15px; width: 100%;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); margin: 0 auto;">
                  <tr>
                    <td style="background-color: #e53e3e; height: 6px; font-size: 0; line-height: 0;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px; text-align: center;">
                      <div style="font-size: 28px; font-weight: 800; color: #1a1a1a; margin-bottom: 30px; letter-spacing: -0.5px;">Booking System</div>
                      <div style="color: #4a5568; font-size: 16px; line-height: 1.6; text-align: left; margin-bottom: 25px;">
                        ${greeting}<br><br>
                        We received a request to reset your password for your Booking System account.
                      </div>
                      <a href="#" style="display: inline-block; background-color: #e53e3e; color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 6px; font-weight: bold; font-size: 16px; margin: 15px 0 30px; box-shadow: 0 2px 4px rgba(229, 62, 62, 0.3);">Reset Password</a>
                      
                      <div style="background-color: #fffaf0; border-left: 4px solid #ed8936; padding: 15px 20px; border-radius: 4px; text-align: left; margin-top: 10px;">
                        <p style="color: #c05621; font-size: 14px; margin: 0; line-height: 1.5;">
                          <strong style="font-weight: 700;">Security Notice:</strong> If you didn't request this password reset, please ignore this email. This link will expire in 1 hour for security reasons.
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="color: #718096; font-size: 13px; margin: 0;">If you have any questions, please contact our support team.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
        ${greeting},
        
        We received a request to reset your password for your Booking System account.
        
        Please click the link below to reset your password. This link will expire in 1 hour for security reasons.
        
        If you didn't request this password reset, please ignore this email.
        If you have any questions, please contact our support team.
      `
    };
  }
}
