import { Test, TestingModule } from '@nestjs/testing';
import { EmailService, EmailTemplateType } from '../email.service';
import { EmailTemplatesService } from '../email-templates.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('EmailService', () => {
  let service: EmailService;
  let mockMailerService: jest.Mocked<MailerService>;
  let mockEmailTemplatesService: jest.Mocked<EmailTemplatesService>;

  beforeEach(async () => {
    mockMailerService = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
    } as any;

    mockEmailTemplatesService = {
      generateTemplate: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
        {
          provide: EmailTemplatesService,
          useValue: mockEmailTemplatesService,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('sendEmailTemplate', () => {
    it('should send OTP email successfully', async () => {
      const emailData = {
        to: 'test@example.com',
        templateType: EmailTemplateType.OTP,
        context: {
          otp: '123456',
          userName: 'Test User',
        },
      };

      const mockTemplate = {
        subject: 'Your OTP Verification Code',
        html: '<html>OTP content</html>',
        text: 'OTP content',
      };

      mockEmailTemplatesService.generateTemplate.mockReturnValue(mockTemplate);

      await service.sendEmailTemplate(emailData);

      expect(mockEmailTemplatesService.generateTemplate).toHaveBeenCalledWith(
        EmailTemplateType.OTP,
        emailData.context
      );
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: emailData.to,
        subject: mockTemplate.subject,
        html: mockTemplate.html,
      });
    });

    it('should send welcome email successfully', async () => {
      const emailData = {
        to: 'test@example.com',
        templateType: EmailTemplateType.WELCOME,
        context: {
          userName: 'Test User',
          userEmail: 'test@example.com',
        },
      };

      const mockTemplate = {
        subject: 'Welcome to Booking System',
        html: '<html>Welcome content</html>',
        text: 'Welcome content',
      };

      mockEmailTemplatesService.generateTemplate.mockReturnValue(mockTemplate);

      await service.sendEmailTemplate(emailData);

      expect(mockEmailTemplatesService.generateTemplate).toHaveBeenCalledWith(
        EmailTemplateType.WELCOME,
        emailData.context
      );
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: emailData.to,
        subject: mockTemplate.subject,
        html: mockTemplate.html,
      });
    });

    it('should send password reset email successfully', async () => {
      const emailData = {
        to: 'test@example.com',
        templateType: EmailTemplateType.PASSWORD_RESET,
        context: {
          userName: 'Test User',
        },
      };

      const mockTemplate = {
        subject: 'Password Reset Request',
        html: '<html>Password reset content</html>',
        text: 'Password reset content',
      };

      mockEmailTemplatesService.generateTemplate.mockReturnValue(mockTemplate);

      await service.sendEmailTemplate(emailData);

      expect(mockEmailTemplatesService.generateTemplate).toHaveBeenCalledWith(
        EmailTemplateType.PASSWORD_RESET,
        emailData.context
      );
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: emailData.to,
        subject: mockTemplate.subject,
        html: mockTemplate.html,
      });
    });

    it('should handle email sending errors', async () => {
      const emailData = {
        to: 'test@example.com',
        templateType: EmailTemplateType.OTP,
        context: { otp: '123456' },
      };

      const error = new Error('Email service failed');
      mockMailerService.sendMail.mockRejectedValue(error);
      mockEmailTemplatesService.generateTemplate.mockReturnValue({
        subject: 'Test',
        html: 'Test',
        text: 'Test',
      });

      await expect(service.sendEmailTemplate(emailData)).rejects.toThrow('Failed to send email: Email service failed');
    });

    it('should handle template generation errors', async () => {
      const emailData = {
        to: 'test@example.com',
        templateType: EmailTemplateType.OTP,
        context: { otp: '123456' },
      };

      const error = new Error('Template generation failed');
      mockEmailTemplatesService.generateTemplate.mockImplementation(() => {
        throw error;
      });

      await expect(service.sendEmailTemplate(emailData)).rejects.toThrow('Failed to send email: Template generation failed');
    });

    it('should handle unknown template type', async () => {
      const emailData = {
        to: 'test@example.com',
        templateType: 'UNKNOWN' as EmailTemplateType,
        context: { otp: '123456' },
      };

      const error = new Error('Unknown email template type: UNKNOWN');
      mockEmailTemplatesService.generateTemplate.mockImplementation(() => {
        throw error;
      });

      await expect(service.sendEmailTemplate(emailData)).rejects.toThrow('Failed to send email: Unknown email template type: UNKNOWN');
    });

    it('should work with minimal context for OTP', async () => {
      const emailData = {
        to: 'test@example.com',
        templateType: EmailTemplateType.OTP,
        context: { otp: '123456' },
      };

      const mockTemplate = {
        subject: 'Your OTP Verification Code',
        html: '<html>OTP content</html>',
        text: 'OTP content',
      };

      mockEmailTemplatesService.generateTemplate.mockReturnValue(mockTemplate);

      await service.sendEmailTemplate(emailData);

      expect(mockEmailTemplatesService.generateTemplate).toHaveBeenCalledWith(
        EmailTemplateType.OTP,
        { otp: '123456' }
      );
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: emailData.to,
        subject: mockTemplate.subject,
        html: mockTemplate.html,
      });
    });

    it('should work with minimal context for password reset', async () => {
      const emailData = {
        to: 'test@example.com',
        templateType: EmailTemplateType.PASSWORD_RESET,
        context: {},
      };

      const mockTemplate = {
        subject: 'Password Reset Request',
        html: '<html>Password reset content</html>',
        text: 'Password reset content',
      };

      mockEmailTemplatesService.generateTemplate.mockReturnValue(mockTemplate);

      await service.sendEmailTemplate(emailData);

      expect(mockEmailTemplatesService.generateTemplate).toHaveBeenCalledWith(
        EmailTemplateType.PASSWORD_RESET,
        {}
      );
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: emailData.to,
        subject: mockTemplate.subject,
        html: mockTemplate.html,
      });
    });
  });
});
