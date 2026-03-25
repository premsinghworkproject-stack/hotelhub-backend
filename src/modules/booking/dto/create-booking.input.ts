import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsInt, IsDate } from 'class-validator';

@InputType()
export class CreateBookingInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  hotelId: number;

  @Field()
  @IsNotEmpty()
  @IsDate()
  checkIn: Date;

  @Field()
  @IsNotEmpty()
  @IsDate()
  checkOut: Date;
}
