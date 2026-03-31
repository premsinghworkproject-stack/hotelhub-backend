import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsOptional, IsString, MaxLength, IsNumber, IsNotEmpty } from 'class-validator';

@InputType()
export class ImageUrlInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  url: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  altText?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;

  @Field({ nullable: true })
  @IsOptional()
  isPrimary?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

@InputType()
export class MultipleImageUrlInput {
  @Field(() => [ImageUrlInput], { nullable: true })
  @IsArray()
  @IsOptional()
  images?: ImageUrlInput[];
}

@InputType()
export class ImageUpdateInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  altText?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;

  @Field({ nullable: true })
  @IsOptional()
  isPrimary?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
