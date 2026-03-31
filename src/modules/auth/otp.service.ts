import { Injectable, NotFoundException } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { OTP } from '../../database/models/otp.model';
import { OTPRepository } from './otp.repository';
import { OTPStatusResponse } from './otp.types';

@Injectable()
export class OTPService {
  constructor(private readonly otpRepository: OTPRepository) {}

  /**
   * Generate and store OTP for email
   * 
   * @param email - User email address
   * @param type - Type of OTP (EMAIL_VERIFICATION or PASSWORD_RESET)
   * @param userId - Optional user ID for relationship
   * @returns Generated OTP
   * 
   * @throws GraphQLError - If OTP generation fails
   */
  async generateOTP(email: string, type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET' = 'EMAIL_VERIFICATION', userId?: number): Promise<string> {
    try {
      // Check if user already has an active OTP of the same type
      const existingOTP = await this.otpRepository.findByEmailAndType(email, type);
      
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

      const otpData = {
        email: email.toLowerCase().trim(),
        otp: otp,
        attempts: 0,
        isVerified: false,
        expiresAt,
        userId: userId || null,
        type: type,
      };

      if (existingOTP) {
        // Update existing OTP by creating a new one (the old one will expire naturally)
        await this.otpRepository.create(otpData);
      } else {
        // Create new OTP
        await this.otpRepository.create(otpData);
      }

      return otp;
    } catch (error) {
      throw new GraphQLError('Failed to generate OTP', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  }

  /**
   * Verify OTP for email
   * 
   * @param email - User email address
   * @param otp - OTP code to verify
   * @param type - OTP type (EMAIL_VERIFICATION or PASSWORD_RESET)
   * @returns Verification result
   * 
   * @throws GraphQLError - If OTP verification fails
   */
  async verifyOTP(email: string, otp: string, type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET' = 'EMAIL_VERIFICATION'): Promise<{ success: boolean; message: string } | null> {
    try {
      const existingOTP = await this.otpRepository.findByEmailAndOTPAndType(email, otp, type);
      
      if (!existingOTP) {
        return null;
      }

      if (existingOTP.attempts >= 3) {
        return { success: false, message: 'Too many attempts. Please request a new OTP.' };
      }

      if (existingOTP.expiresAt < new Date()) {
        return { success: false, message: 'OTP has expired. Please request a new OTP.' };
      }

      // Increment attempts
      await this.otpRepository.incrementAttempts(email, type);

      // Mark OTP as verified
      await this.otpRepository.markAsVerified(email, type);
      
      return { success: true, message: 'OTP verified successfully' };
    } catch (error) {
      throw new GraphQLError('Failed to verify OTP', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  }

  /**
   * Check OTP status for email
   * 
   * @param email - User email address
   * @returns OTP status
   * 
   * @throws GraphQLError - If status check fails
   */
  async checkOTPStatus(email: string): Promise<OTPStatusResponse> {
    try {
      const existingOTP = await this.otpRepository.findByEmail(email);
      
      if (!existingOTP) {
        return { hasActiveOTP: false };
      }
      
      return {
        hasActiveOTP: true,
        expiresAt: existingOTP.expiresAt,
      };
    } catch (error) {
      throw new GraphQLError('Failed to check OTP status', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  }

  /**
   * Increment OTP attempts (called when verification fails)
   * 
   * @param email - User email address
   * @param otp - OTP code that failed
   * @returns Remaining attempts
   * 
   * @throws GraphQLError - If increment fails
   */
  async incrementAttempts(email: string, otp: string): Promise<number> {
    try {
      const existingOTP = await this.otpRepository.findByEmailAndOTP(email, otp);
      
      if (!existingOTP) {
        throw new GraphQLError('Invalid OTP', {
          extensions: {
            code: 'INVALID_OTP',
          },
        });
      }

      const updatedOTP = await this.otpRepository.incrementAttempts(email);
      const remainingAttempts = 3 - updatedOTP.attempts;
      
      if (remainingAttempts <= 0) {
        throw new GraphQLError('Too many attempts. Please request a new OTP.', {
          extensions: {
            code: 'OTP_EXPIRED',
          },
        });
      }

      return remainingAttempts;
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }
      
      throw new GraphQLError('Failed to increment OTP attempts', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  }

  /**
   * Clean up expired OTPs
   * 
   * @returns Number of cleaned up OTPs
   */
  async cleanupExpiredOTPs(): Promise<number> {
    try {
      return await this.otpRepository.deleteExpiredOTPs();
    } catch (error) {
      console.error('Failed to cleanup expired OTPs:', error);
      return 0;
    }
  }

  /**
   * Get OTP statistics
   * 
   * @returns OTP statistics
   */
  async getOTPStatistics(): Promise<{
    total: number;
    active: number;
    expired: number;
    verified: number;
  }> {
    try {
      return await this.otpRepository.getOTPStatistics();
    } catch (error) {
      console.error('Failed to get OTP statistics:', error);
      return {
        total: 0,
        active: 0,
        expired: 0,
        verified: 0,
      };
    }
  }

  /**
   * Get OTP record for email and type
   * 
   * @param email - User email address
   * @param type - OTP type
   * @returns OTP record or null
   */
  async getOTPRecord(email: string, type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET' = 'EMAIL_VERIFICATION'): Promise<OTP | null> {
    return await this.otpRepository.findByEmailAndType(email, type);
  }
}
