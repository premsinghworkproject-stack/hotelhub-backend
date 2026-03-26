import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { User } from '../../database/models/user.model';
import { UserService } from '../user/user.service';
import { CreateUserInput } from '../user/dto/create-user.input';
import { OTPService } from './otp.service';
import { JwtService } from '@nestjs/jwt';
import { SignupInput, LoginInput, VerifyOTPInput, ResendOTPInput, ForgotPasswordInput, VerifyForgotPasswordOTPInput, ResetPasswordInput } from './dto/auth.input';
import { AuthResponse, LoginResponse, OTPResponse, ForgotPasswordResponse, VerifyForgotPasswordOTPResponse } from './auth.types';
import { EmailService, EmailTemplateType } from '../../common/email/email.service';
import { PasswordUtil } from '../../common/utils/password.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly otpService: OTPService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) { }

  /**
   * Signup new user
   * 
   * @param signupInput - User signup data
   * @returns Authentication response
   * 
   * @throws GraphQLError - If signup fails
   */
  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    try {
      const { name, email, password } = signupInput;

      // Validate input
      if (!name || name.trim().length === 0) {
        throw new GraphQLError('Name is required', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'name'
          }
        });
      }

      if (!email || email.trim().length === 0) {
        throw new GraphQLError('Email is required', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'email'
          }
        });
      }

      if (!password || password.length < 6) {
        throw new GraphQLError('Password must be at least 6 characters long', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'password'
          }
        });
      }

      // Validate password strength
      const passwordValidation = PasswordUtil.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        throw new GraphQLError(passwordValidation.message, {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'password'
          }
        });
      }

      // Check if user already exists
      const existingUser = await this.userService.findByEmail(email.toLowerCase().trim());
      if (existingUser) {
        // Generate OTP for existing user
        const otp = await this.otpService.generateOTP(email.toLowerCase().trim(), 'EMAIL_VERIFICATION', existingUser.id);
        await this.emailService.sendEmailTemplate({
          to: email,
          templateType: EmailTemplateType.OTP,
          context: { otp, userName: existingUser.name }
        });

        return {
          success: false,
          message: 'User already exists. OTP sent to your email for verification.'
        };
      }

      // Create new user with hashed password
      const hashedPassword = await PasswordUtil.hashPassword(password.trim());
      console.log('Hashed password length:', hashedPassword.length);
      console.log('Creating user with password field included');

      const newUser = await this.userService.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        userType: signupInput.userType,
        companyName: signupInput.companyName?.trim()
      });

      console.log('Created user ID:', newUser.id);
      console.log('User password field exists:', !!newUser.password);
      console.log('User password length:', newUser.password?.length);

      // Generate OTP for email verification
      const otp = await this.otpService.generateOTP(email.toLowerCase().trim(), 'EMAIL_VERIFICATION', newUser.id);

      // Send verification OTP email
      await this.emailService.sendEmailTemplate({
        to: newUser.email,
        templateType: EmailTemplateType.OTP,
        context: { otp, userName: newUser.name }
      });

      return {
        success: false,
        message: 'Account created successfully! Please check your email for verification OTP to complete registration.'
      };
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }

      throw new GraphQLError('Failed to signup', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          field: 'signup'
        }
      });
    }
  }

  /**
   * Login user
   * 
   * @param loginInput - User login data
   * @returns Login response
   * 
   * @throws GraphQLError - If login fails
   */
  async login(loginInput: LoginInput): Promise<LoginResponse> {
    try {
      const { email, password } = loginInput;

      // Validate input
      if (!email || email.trim().length === 0) {
        throw new GraphQLError('Email is required', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'email'
          }
        });
      }

      if (!password) {
        throw new GraphQLError('Password is required', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'password'
          }
        });
      }

      // Find user
      const user = await this.userService.findByEmail(email.toLowerCase().trim());
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Check if user has active OTP
      const otpStatus = await this.otpService.checkOTPStatus(email.toLowerCase().trim());
      if (otpStatus.hasActiveOTP) {
        return {
          success: false,
          message: 'OTP verification required',
          requiresOTP: true
        };
      }

      // Verify password
      if (!user.password) {
        return {
          success: false,
          message: 'Password not set for this account'
        };
      }

      const isPasswordValid = await PasswordUtil.comparePassword(password, user.password);

      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid password'
        };
      }

      // Generate JWT token
      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        name: user.name
      }, {
        expiresIn: '7d'
      });

      return {
        success: true,
        token
      };
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }

      throw new GraphQLError('Failed to login', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          field: 'login'
        }
      });
    }
  }

  /**
   * Resend OTP
   * 
   * @param resendOTPInput - Email for OTP resend
   * @returns OTP response
   * 
   * @throws GraphQLError - If resend fails
   */
  async resendOTP(resendOTPInput: ResendOTPInput): Promise<OTPResponse> {
    try {
      const { email } = resendOTPInput;

      // Validate input
      if (!email || email.trim().length === 0) {
        throw new GraphQLError('Email is required', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'email'
          }
        });
      }

      // Check if user exists
      const user = await this.userService.findByEmail(email.toLowerCase().trim());
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Generate and send new OTP
      const otp = await this.otpService.generateOTP(email.toLowerCase().trim(), 'EMAIL_VERIFICATION', user.id);
      await this.emailService.sendEmailTemplate({
        to: email,
        templateType: EmailTemplateType.OTP,
        context: { otp, userName: user.name }
      });

      return {
        success: true,
        message: 'OTP sent to your email'
      };
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }

      throw new GraphQLError('Failed to resend OTP', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          field: 'otp'
        }
      });
    }
  }

  /**
   * Complete OTP verification and login
   * 
   * @param verifyOTPInput - OTP verification data
   * @returns Login response with token
   * 
   * @throws GraphQLError - If verification fails
   */
  async completeOTPVerification(verifyOTPInput: VerifyOTPInput): Promise<LoginResponse> {
    try {
      const { email, otp } = verifyOTPInput;

      const result = await this.otpService.verifyOTP(email.toLowerCase().trim(), otp);

      if (!result.success) {
        return {
          success: false,
          message: result.message
        };
      }

      // Find user and mark email as verified
      const user = await this.userService.findByEmail(email.toLowerCase().trim());
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Mark user's email as verified
      await this.userService.markEmailAsVerified(email.toLowerCase().trim());

      // Generate JWT token
      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        name: user.name
      });

      return {
        success: true,
        token,
        message: 'OTP verified successfully'
      };
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }

      throw new GraphQLError('Failed to complete OTP verification', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          field: 'otp'
        }
      });
    }
  }

  /**
   * Forgot password with edge case handling
   * 
   * @param forgotPasswordInput - User email for password reset
   * @returns Forgot password response with appropriate error handling
   */
  async forgotPassword(forgotPasswordInput: ForgotPasswordInput): Promise<ForgotPasswordResponse> {
    try {
      const { email } = forgotPasswordInput;

      // Validate input
      if (!email || email.trim().length === 0) {
        throw new GraphQLError('Email is required', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'email'
          }
        });
      }

      // Check if user exists
      const user = await this.userService.findByEmail(email.toLowerCase().trim());
      if (!user) {
        return {
          success: false,
          message: 'No account found with this email address'
        };
      }

      // Check if account is deleted
      if (user.isDeleted) {
        return {
          success: false,
          message: 'Account has been deleted',
          accountDeleted: true
        };
      }

      // Check if email is verified
      if (!user.isEmailVerified) {
        // Send email verification OTP instead
        const otp = await this.otpService.generateOTP(email.toLowerCase().trim(), 'EMAIL_VERIFICATION', user.id);
        await this.emailService.sendEmailTemplate({
          to: email,
          templateType: EmailTemplateType.OTP,
          context: { otp, userName: user.name }
        });

        return {
          success: false,
          message: 'Email not verified. Verification OTP sent to your email.',
          requiresEmailVerification: true
        };
      }

      // Generate password reset OTP
      const otp = await this.otpService.generateOTP(email.toLowerCase().trim(), 'PASSWORD_RESET', user.id);
      await this.emailService.sendEmailTemplate({
        to: email,
        templateType: EmailTemplateType.OTP,
        context: { otp, userName: user.name }
      });

      return {
        success: true,
        message: 'Password reset OTP sent to your email'
      };

    } catch (error) {
      console.error('Forgot password error:', error);
      throw new GraphQLError('Failed to process forgot password request', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        }
      });
    }
  }

  /**
   * Verify forgot password OTP
   * 
   * @param verifyForgotPasswordOTPInput - Email and OTP for verification
   * @returns Verification response with reset token
   */
  async verifyForgotPasswordOTP(verifyForgotPasswordOTPInput: VerifyForgotPasswordOTPInput): Promise<VerifyForgotPasswordOTPResponse> {
    try {
      const { email, otp } = verifyForgotPasswordOTPInput;

      // Validate input
      if (!email || email.trim().length === 0) {
        throw new GraphQLError('Email is required', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'email'
          }
        });
      }

      if (!otp || otp.trim().length === 0) {
        throw new GraphQLError('OTP is required', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'otp'
          }
        });
      }

      // Verify OTP
      const otpResult = await this.otpService.verifyOTP(email.toLowerCase().trim(), otp.trim(), 'PASSWORD_RESET');

      if (!otpResult) {
        return {
          success: false,
          message: 'Invalid or expired OTP'
        };
      }

      // Generate reset token (short-lived JWT)
      const resetToken = this.jwtService.sign(
        {
          email: email.toLowerCase().trim(),
          type: 'PASSWORD_RESET'
        },
        { expiresIn: '15m' }
      );

      return {
        success: true,
        message: 'OTP verified successfully. You can now reset your password.',
        resetToken
      };

    } catch (error) {
      console.error('Verify forgot password OTP error:', error);
      throw new GraphQLError('Failed to verify OTP', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        }
      });
    }
  }

  /**
   * Reset password using OTP verification
   * 
   * @param resetPasswordInput - Email, OTP, and new password
   * @returns Authentication response
   */
  async resetPassword(resetPasswordInput: ResetPasswordInput): Promise<AuthResponse> {
    try {
      const { email, newPassword, resetToken } = resetPasswordInput;

      // Validate input
      if (!email || email.trim().length === 0) {
        throw new GraphQLError('Email is required', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'email'
          }
        });
      }

      if (!newPassword || newPassword.trim().length === 0) {
        throw new GraphQLError('New password is required', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'newPassword'
          }
        });
      }

      if (newPassword.length < 6) {
        throw new GraphQLError('Password must be at least 6 characters long', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'newPassword'
          }
        });
      }

      // Validate password strength
      const passwordValidation = PasswordUtil.validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        throw new GraphQLError(passwordValidation.message, {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'newPassword'
          }
        });
      }

      if (!resetToken || resetToken.trim().length === 0) {
        throw new GraphQLError('Reset token is required', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'resetToken'
          }
        });
      }

      // Verify the reset token and check expiration
      let decodedToken;
      try {
        decodedToken = this.jwtService.verify(resetToken);
      } catch (error) {
        return {
          success: false,
          message: 'Invalid or expired reset token'
        };
      }

      // Verify token payload
      if (!decodedToken.email || !decodedToken.type || decodedToken.type !== 'PASSWORD_RESET') {
        return {
          success: false,
          message: 'Invalid reset token'
        };
      }

      // Verify token matches the provided email
      if (decodedToken.email !== email.toLowerCase().trim()) {
        return {
          success: false,
          message: 'Token email mismatch'
        };
      }

      // Find user
      const user = await this.userService.findByEmail(email.toLowerCase().trim());
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Check if account is deleted
      if (user.isDeleted) {
        return {
          success: false,
          message: 'Account has been deleted'
        };
      }

      // Hash the new password and update user
      const hashedPassword = await PasswordUtil.hashPassword(newPassword.trim());
      await this.userService.update(user.id, {
        password: hashedPassword,
        isEmailVerified: true,
        emailVerifiedAt: new Date()
      });

      // Send password reset confirmation email
      try {
        await this.emailService.sendEmailTemplate({
          to: email,
          templateType: EmailTemplateType.PASSWORD_RESET,
          context: {
            userName: user.name
          }
        });
      } catch (emailError) {
        console.error('Failed to send password reset confirmation email:', emailError);
        // Continue with the process even if email fails
      }

      // Generate authentication token
      const token = this.jwtService.sign({
        id: user.id,
        email: user.email
      });

      return {
        success: true,
        token,
        message: 'Password reset successful'
      };

    } catch (error) {
      console.error('Reset password error:', error);
      throw new GraphQLError('Failed to reset password', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        }
      });
    }
  }
}
