import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDecimal, IsEnum, Min, Max, IsBoolean, IsArray } from 'class-validator';
import { MultipleImageUploadInput } from '../../../common/dto/image-upload.dto';

@InputType()
export class CreateRoomWithImagesInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  roomNumber: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  floor?: string;

  @Field(() => Int)
  @IsNumber()
  hotelId: number;

  @Field(() => Int)
  @IsNumber()
  roomTypeId: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDecimal()
  customPrice?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isSmokingAllowed?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPetFriendly?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasMinibar?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasSafe?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasBalcony?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasBathtub?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasShower?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasKitchenette?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasWorkDesk?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasTV?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasWiFi?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasAirConditioning?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasHeating?: boolean;

  @Field(() => MultipleImageUploadInput, { nullable: true })
  @IsOptional()
  images?: MultipleImageUploadInput;
}

@InputType()
export class UpdateRoomWithImagesInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  roomNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  floor?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDecimal()
  customPrice?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isSmokingAllowed?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPetFriendly?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasMinibar?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasSafe?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasBalcony?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasBathtub?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasShower?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasKitchenette?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasWorkDesk?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasTV?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasWiFi?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasAirConditioning?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasHeating?: boolean;

  @Field(() => MultipleImageUploadInput, { nullable: true })
  @IsOptional()
  newImages?: MultipleImageUploadInput;

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @IsOptional()
  deleteImageIds?: number[];
}
