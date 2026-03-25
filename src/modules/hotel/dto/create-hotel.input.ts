import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateHotelInput {
  @Field()
  name: string;

  @Field()
  location: string;

  @Field()
  price: number;
}

@InputType()
export class UpdateHotelInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  price?: number;
}
