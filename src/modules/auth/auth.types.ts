import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User, UserType } from '../../database/models/user.model';

@ObjectType()
export class AuthResponse {
  @Field(() => String, { nullable: true })
  token?: string;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => Boolean)
  success: boolean;

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class OTPResponse {
  @Field(() => String)
  message: string;

  @Field(() => Boolean)
  success: boolean;

  @Field(() => String, { nullable: true })
  otpId?: string;
}

@ObjectType()
export class LoginResponse {
  @Field(() => String, { nullable: true })
  token?: string;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => Boolean)
  success: boolean;

  @Field(() => Boolean, { nullable: true })
  requiresOTP?: boolean;

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class ForgotPasswordResponse {
  @Field(() => String)
  message: string;

  @Field(() => Boolean)
  success: boolean;

  @Field(() => String, { nullable: true })
  requiresEmailVerification?: boolean;

  @Field(() => String, { nullable: true })
  accountDeleted?: boolean;
}

@ObjectType()
export class VerifyForgotPasswordOTPResponse {
  @Field(() => String)
  message: string;

  @Field(() => Boolean)
  success: boolean;

  @Field(() => String, { nullable: true })
  resetToken?: string;
}
