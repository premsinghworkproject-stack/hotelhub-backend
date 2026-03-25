import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OTP } from '../../database/models/otp.model';
import { User } from '../../database/models/user.model';
import { Op } from 'sequelize';

@Injectable()
export class OTPRepository {
  constructor(
    @InjectModel(OTP)
    private readonly otpModel: typeof OTP,
  ) {}

  /**
   * Create a new OTP record
   * 
   * @param otpData - OTP data to create
   * @returns Created OTP record
   */
  async create(otpData: Partial<OTP>): Promise<OTP> {
    return await this.otpModel.create(otpData as any);
  }

  /**
   * Find OTP by email
   * 
   * @param email - User email address
   * @returns OTP record or null
   */
  async findByEmail(email: string): Promise<OTP | null> {
    return await this.otpModel.findOne({
      where: {
        email,
        isVerified: false,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Find OTP by email and type
   * 
   * @param email - User email address
   * @param type - OTP type (EMAIL_VERIFICATION or PASSWORD_RESET)
   * @returns OTP record or null
   */
  async findByEmailAndType(email: string, type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET'): Promise<OTP | null> {
    return await this.otpModel.findOne({
      where: {
        email,
        type,
        isVerified: false,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Find OTP by email and OTP code
   * 
   * @param email - User email address
   * @param otp - OTP code
   * @returns OTP record or null
   */
  async findByEmailAndOTP(email: string, otp: string): Promise<OTP | null> {
    return await this.otpModel.findOne({
      where: {
        email,
        otp,
        isVerified: false,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
    });
  }

  /**
   * Find OTP by email, OTP code, and type
   * 
   * @param email - User email address
   * @param otp - OTP code
   * @param type - OTP type
   * @returns OTP record or null
   */
  async findByEmailAndOTPAndType(email: string, otp: string, type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET'): Promise<OTP | null> {
    return await this.otpModel.findOne({
      where: {
        email,
        otp,
        type,
        isVerified: false,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Mark OTP as verified
   * 
   * @param email - User email address
   * @param type - OTP type
   * @returns Updated OTP record
   */
  async markAsVerified(email: string, type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET' = 'EMAIL_VERIFICATION'): Promise<OTP> {
    const otp = await this.otpModel.findOne({
      where: {
        email,
        type,
        isVerified: false,
      },
      order: [['createdAt', 'DESC']],
    });

    if (!otp) {
      throw new Error('No valid OTP found for this email and type');
    }

    return await otp.update({ isVerified: true });
  }

  /**
   * Increment OTP attempts
   * 
   * @param email - User email address
   * @param type - OTP type (optional, defaults to EMAIL_VERIFICATION)
   * @returns Updated OTP record
   */
  async incrementAttempts(email: string, type?: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET'): Promise<OTP> {
    const whereCondition: any = {
      email,
      isVerified: false,
    };

    if (type) {
      whereCondition.type = type;
    }

    const otp = await this.otpModel.findOne({
      where: whereCondition,
      order: [['createdAt', 'DESC']],
    });
    
    if (!otp) {
      throw new Error('OTP not found');
    }

    return await otp.update({ attempts: otp.attempts + 1 });
  }

  /**
   * Delete expired OTPs
   * 
   * @returns Number of deleted records
   */
  async deleteExpiredOTPs(): Promise<number> {
    const deletedCount = await this.otpModel.destroy({
      where: {
        expiresAt: {
          [Op.lt]: new Date(),
        },
      },
    });

    return deletedCount;
  }

  /**
   * Find OTP by user ID
   * 
   * @param userId - User ID
   * @returns OTP record or null
   */
  async findByUserId(userId: number): Promise<OTP | null> {
    return await this.otpModel.findOne({
      where: {
        userId,
        isVerified: false,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Clean up verified OTPs for a user
   * 
   * @param email - User email address
   * @returns Number of deleted records
   */
  async cleanupVerifiedOTPs(email: string): Promise<number> {
    return await this.otpModel.destroy({
      where: {
        email,
        isVerified: true,
      },
    });
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
    const now = new Date();
    
    const [total, active, expired, verified] = await Promise.all([
      this.otpModel.count(),
      this.otpModel.count({
        where: {
          isVerified: false,
          expiresAt: {
            [Op.gt]: now,
          },
        },
      }),
      this.otpModel.count({
        where: {
          expiresAt: {
            [Op.lt]: now,
          },
        },
      }),
      this.otpModel.count({
        where: {
          isVerified: true,
        },
      }),
    ]);

    return { total, active, expired, verified };
  }
}
