import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { UserType } from '../../../database/models/user.model';

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;

  @Field(() => UserType)
  @IsEnum(UserType)
  @IsNotEmpty()
  userType: UserType;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  companyName?: string;
}
