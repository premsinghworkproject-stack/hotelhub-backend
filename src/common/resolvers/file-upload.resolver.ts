import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { FileUploadService } from '../services/file-upload.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../guards/auth.guard';
import { AuthUser } from '../decorators/user.decorator';
import { UserTokenPayload } from '../constants/app.constant';
import { UploadScalar } from '../scalars/upload.scalar';

@Resolver()
export class FileUploadResolver {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Mutation(() => String, { 
    name: 'uploadFile',
    description: 'Upload a single file and return the Cloudinary URL'
  })
  @UseGuards(GqlAuthGuard)
  async uploadFile(
    @Args('file', { type: () => UploadScalar }) file: any,
    @Args('folder', { nullable: true }) folder?: string
  ): Promise<string> {
    try {
      const result = await this.fileUploadService.uploadFile(file, 'USERS');
      return result.secureUrl;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  @Mutation(() => [String], { 
    name: 'uploadMultipleFiles',
    description: 'Upload multiple files and return the Cloudinary URLs'
  })
  @UseGuards(GqlAuthGuard)
  async uploadMultipleFiles(
    @Args('files', { type: () => [UploadScalar] }) files: any[],
    @Args('folder', { nullable: true }) folder?: string
  ): Promise<string[]> {
    try {
      const results = await this.fileUploadService.uploadMultipleFiles(files, 'USERS');
      return results.map(result => result.secureUrl);
    } catch (error) {
      throw new Error(`Failed to upload files: ${error.message}`);
    }
  }

  @Mutation(() => [String], { 
    name: 'uploadHotelImages',
    description: 'Upload hotel images and return the Cloudinary URLs'
  })
  @UseGuards(GqlAuthGuard)
  async uploadHotelImages(
    @Args('files', { type: () => [UploadScalar] }) files: any[],
    @AuthUser() user: UserTokenPayload
  ): Promise<string[]> {
    try {
      const results = await this.fileUploadService.uploadMultipleFiles(files, 'HOTELS');
      return results.map(result => result.secureUrl);
    } catch (error) {
      throw new Error(`Failed to upload hotel images: ${error.message}`);
    }
  }

  @Mutation(() => [String], { 
    name: 'uploadRoomTypeImages',
    description: 'Upload room type images and return the Cloudinary URLs'
  })
  @UseGuards(GqlAuthGuard)
  async uploadRoomTypeImages(
    @Args('files', { type: () => [UploadScalar] }) files: any[],
    @AuthUser() user: UserTokenPayload
  ): Promise<string[]> {
    try {
      const results = await this.fileUploadService.uploadMultipleFiles(files, 'ROOM_TYPES');
      return results.map(result => result.secureUrl);
    } catch (error) {
      throw new Error(`Failed to upload room type images: ${error.message}`);
    }
  }

  @Mutation(() => [String], { 
    name: 'uploadRoomImages',
    description: 'Upload room images and return the Cloudinary URLs'
  })
  @UseGuards(GqlAuthGuard)
  async uploadRoomImages(
    @Args('files', { type: () => [UploadScalar] }) files: any[],
    @AuthUser() user: UserTokenPayload
  ): Promise<string[]> {
    try {
      const results = await this.fileUploadService.uploadMultipleFiles(files, 'ROOMS');
      return results.map(result => result.secureUrl);
    } catch (error) {
      throw new Error(`Failed to upload room images: ${error.message}`);
    }
  }

  @Mutation(() => Boolean, { 
    name: 'deleteFile',
    description: 'Delete a file from Cloudinary using its public ID'
  })
  @UseGuards(GqlAuthGuard)
  async deleteFile(
    @Args('publicId') publicId: string,
    @AuthUser() user: UserTokenPayload
  ): Promise<boolean> {
    try {
      await this.fileUploadService.deleteFile(publicId);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}
