import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';
import { UploadScalar } from '../scalars/upload.scalar';

@InputType()
export class ImageUploadInput {
  @Field(() => UploadScalar, { nullable: true })
  @IsOptional()
  file?: any;

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
  sortOrder?: number;
}

@InputType()
export class MultipleImageUploadInput {
  @Field(() => [UploadScalar], { nullable: true })
  @IsArray()
  @IsOptional()
  files?: any[];

  @Field(() => [ImageUploadInput], { nullable: true })
  @IsArray()
  @IsOptional()
  imageData?: ImageUploadInput[];
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
  sortOrder?: number;
}
