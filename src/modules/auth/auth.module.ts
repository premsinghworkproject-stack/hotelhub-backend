import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { OTPService } from './otp.service';
import { OTPRepository } from './otp.repository';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from '../../common/email/email.module';
import { UserModule } from '../user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { OTP } from '../../database/models/otp.model';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    ConfigModule,
    EmailModule, // Import common EmailModule
    UserModule, // Import UserModule to get UserRepository
    SequelizeModule.forFeature([OTP]), // Add OTP model
  ],
  providers: [
    AuthResolver,
    AuthService,
    OTPService,
    OTPRepository,
  ],
  exports: [
    AuthService,
    OTPService,
    OTPRepository,
  ],
})
export class AuthModule {}
