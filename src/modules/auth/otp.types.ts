import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class OTPStatusResponse {
  @Field(() => Boolean)
  hasActiveOTP: boolean;

  @Field(() => Date, { nullable: true })
  expiresAt?: Date;
}
