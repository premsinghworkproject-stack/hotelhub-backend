import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDecimal, IsEnum, Min, Max, IsBoolean } from 'class-validator';
import { SearchHotelsInput as ISearchHotelsInput } from '../../../common/interfaces/search-hotels.input';

export enum MealPlan {
  NONE = 'NONE',
  BREAKFAST_ONLY = 'BREAKFAST_ONLY',
  BREAKFAST_LUNCH = 'BREAKFAST_LUNCH',
  BREAKFAST_LUNCH_DINNER = 'BREAKFAST_LUNCH_DINNER',
  ALL_MEALS = 'ALL_MEALS'
}

export enum PropertyType {
  HOTEL = 'HOTEL',
  RESORT = 'RESORT',
  GUEST_HOUSE = 'GUEST_HOUSE',
  APARTMENT = 'APARTMENT',
  VILLA = 'VILLA'
}

// Register enums with GraphQL
registerEnumType(MealPlan, {
  name: 'MealPlan',
  description: 'Hotel meal plan options',
});

registerEnumType(PropertyType, {
  name: 'PropertyType',
  description: 'Hotel property type classification',
});

@InputType()
export class CreateHotelInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  address: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  city: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  state: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  country: string;

  @Field()
  @IsString()
  @IsOptional()
  postalCode?: string;

  @Field()
  @IsDecimal()
  @IsOptional()
  latitude?: number;

  @Field()
  @IsDecimal()
  @IsOptional()
  longitude?: number;

  @Field()
  @IsString()
  @IsOptional()
  phone?: string;

  @Field()
  @IsString()
  @IsOptional()
  email?: string;

  @Field()
  @IsString()
  @IsOptional()
  website?: string;

  @Field()
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => MealPlan)
  @IsOptional()
  mealPlan?: MealPlan;

  @Field(() => PropertyType)
  @IsOptional()
  propertyType?: PropertyType;

  @Field()
  @IsString()
  @IsOptional()
  checkInTime?: string; // e.g., "14:00", "15:00"

  @Field()
  @IsString()
  @IsOptional()
  checkOutTime?: string; // e.g., "11:00", "12:00"

  @Field()
  @IsString()
  @IsOptional()
  cancellationPolicy?: string;

  @Field()
  @IsString()
  @IsOptional()
  petPolicy?: string;

  @Field()
  @IsString()
  @IsOptional()
  parkingInfo?: string;
}

@InputType()
export class UpdateHotelInput {
  @Field()
  @IsString()
  @IsOptional()
  name?: string;

  @Field()
  @IsString()
  @IsOptional()
  address?: string;

  @Field()
  @IsString()
  @IsOptional()
  city?: string;

  @Field()
  @IsString()
  @IsOptional()
  state?: string;

  @Field()
  @IsString()
  @IsOptional()
  country?: string;

  @Field()
  @IsString()
  @IsOptional()
  postalCode?: string;

  @Field()
  @IsDecimal()
  @IsOptional()
  latitude?: number;

  @Field()
  @IsDecimal()
  @IsOptional()
  longitude?: number;

  @Field()
  @IsString()
  @IsOptional()
  phone?: string;

  @Field()
  @IsString()
  @IsOptional()
  email?: string;

  @Field()
  @IsString()
  @IsOptional()
  website?: string;

  @Field()
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => MealPlan)
  @IsOptional()
  mealPlan?: MealPlan;

  @Field(() => PropertyType)
  @IsOptional()
  propertyType?: PropertyType;

  @Field()
  @IsString()
  @IsOptional()
  checkInTime?: string;

  @Field()
  @IsString()
  @IsOptional()
  checkOutTime?: string;

  @Field()
  @IsString()
  @IsOptional()
  cancellationPolicy?: string;

  @Field()
  @IsString()
  @IsOptional()
  petPolicy?: string;

  @Field()
  @IsString()
  @IsOptional()
  parkingInfo?: string;

  @Field()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field()
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}

@InputType()
export class SearchHotelsInput implements ISearchHotelsInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  searchQuery?: string; // Full-text search across name, description, address

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  city?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  state?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  country?: string;

  @Field({ nullable: true })
  @IsDecimal()
  @IsOptional()
  minRating?: number;

  @Field({ nullable: true })
  @IsDecimal()
  @IsOptional()
  maxRating?: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @Field(() => MealPlan, { nullable: true })
  @IsOptional()
  mealPlan?: MealPlan;

  @Field(() => PropertyType, { nullable: true })
  @IsOptional()
  propertyType?: PropertyType;

  @Field(() => [String], { nullable: true })
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[]; // Array of required amenity names

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  adults?: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(5)
  children?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  checkInDate?: string; // ISO date string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  checkOutDate?: string; // ISO date string

  @Field()
  @IsNumber()
  @IsOptional()
  limit?: number;

  @Field()
  @IsNumber()
  @IsOptional()
  offset?: number;
}
