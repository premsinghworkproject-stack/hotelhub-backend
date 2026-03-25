import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class AuthResponse {
  @Field(() => String, { nullable: true })
  token?: string;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field()
  success: boolean;
}

@ObjectType()
export class OTPResponse {
  @Field()
  message: string;

  @Field()
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

  @Field()
  success: boolean;

  @Field(() => Boolean, { nullable: true })
  requiresOTP?: boolean;
}

@ObjectType()
export class ForgotPasswordResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field(() => String, { nullable: true })
  requiresEmailVerification?: boolean;

  @Field(() => String, { nullable: true })
  accountDeleted?: boolean;
}

@ObjectType()
export class VerifyForgotPasswordOTPResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field(() => String, { nullable: true })
  resetToken?: string;
}
