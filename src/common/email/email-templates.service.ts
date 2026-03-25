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
        return this.generatePasswordResetTemplate(context as { resetToken: string; userName?: string });
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
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #333;
            }
            .content {
              text-align: center;
            }
            .otp-code {
              display: inline-block;
              background-color: #007bff;
              color: #ffffff;
              font-size: 24px;
              font-weight: bold;
              padding: 15px 25px;
              border-radius: 8px;
              margin: 20px 0;
              letter-spacing: 3px;
            }
            .instructions {
              color: #666;
              font-size: 16px;
              margin-bottom: 20px;
            }
            .footer {
              text-align: center;
              color: #999;
              font-size: 14px;
              margin-top: 30px;
            }
            .expiry {
              color: #dc3545;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Booking System</div>
            </div>
            <div class="content">
              <div class="instructions">
                ${greeting},<br><br>
                Your One-Time Password (OTP) for account verification is:
              </div>
              <div class="otp-code">${otp}</div>
              <div class="instructions">
                This OTP will expire in <span class="expiry">10 minutes</span>.<br>
                Please do not share this code with anyone.
              </div>
            </div>
            <div class="footer">
              <p>If you didn't request this OTP, please ignore this email.</p>
              <p>For security reasons, please don't reply to this email.</p>
            </div>
          </div>
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
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #333;
            }
            .content {
              text-align: center;
            }
            .welcome-message {
              font-size: 18px;
              color: #333;
              margin-bottom: 20px;
            }
            .user-details {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .detail-label {
              font-weight: bold;
              color: #666;
            }
            .detail-value {
              color: #333;
            }
            .cta-button {
              display: inline-block;
              background-color: #28a745;
              color: #ffffff;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 6px;
              font-weight: bold;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              color: #999;
              font-size: 14px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Booking System</div>
            </div>
            <div class="content">
              <div class="welcome-message">
                Welcome to Booking System, ${userName}! 🎉
              </div>
              <div class="user-details">
                <div class="detail-row">
                  <span class="detail-label">Name:</span>
                  <span class="detail-value">${userName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">${userEmail}</span>
                </div>
              </div>
              <a href="#" class="cta-button">Get Started</a>
            </div>
            <div class="footer">
              <p>Thank you for joining our platform!</p>
              <p>If you have any questions, please contact our support team.</p>
            </div>
          </div>
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
  private generatePasswordResetTemplate(context: { resetToken: string; userName?: string }): EmailTemplate {
    const { resetToken, userName } = context;
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
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #333;
            }
            .content {
              text-align: center;
            }
            .reset-message {
              font-size: 16px;
              color: #333;
              margin-bottom: 20px;
            }
            .reset-button {
              display: inline-block;
              background-color: #dc3545;
              color: #ffffff;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 6px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #999;
              font-size: 14px;
              margin-top: 30px;
            }
            .security-note {
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              padding: 15px;
              border-radius: 6px;
              margin: 20px 0;
              color: #856404;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Booking System</div>
            </div>
            <div class="content">
              <div class="reset-message">
                ${greeting},<br><br>
                We received a request to reset your password for your Booking System account.
              </div>
              <a href="#" class="reset-button">Reset Password</a>
              <div class="security-note">
                <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. This link will expire in 1 hour for security reasons.
              </div>
            </div>
            <div class="footer">
              <p>If you have any questions, please contact our support team.</p>
            </div>
          </div>
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
