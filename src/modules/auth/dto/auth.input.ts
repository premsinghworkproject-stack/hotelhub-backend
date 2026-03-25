import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class SignupInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}

@InputType()
export class VerifyOTPInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  otp: string;
}

@InputType()
export class ResendOTPInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

@InputType()
export class ForgotPasswordInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

@InputType()
export class VerifyForgotPasswordOTPInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  otp: string;
}

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  resetToken: string;
}
