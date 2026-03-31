import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CONFIG, CLOUDINARY_FOLDERS, UPLOAD_CONFIG } from '../constants/cloudinary.constant';

interface FileUploadOptions {
  transformation?: any;
  publicId?: string;
  resourceType?: 'image' | 'video' | 'auto';
}

interface UploadResult {
  url: string;
  publicId: string;
  secureUrl: string;
}

@Injectable()
export class FileUploadService {
  constructor() {
    cloudinary.config({
      cloud_name: CLOUDINARY_CONFIG.cloudName,
      api_key: CLOUDINARY_CONFIG.apiKey,
      api_secret: CLOUDINARY_CONFIG.apiSecret,
    });
  }

  async uploadFile(
    file: any,
    folder: keyof typeof CLOUDINARY_FOLDERS,
    options?: FileUploadOptions
  ): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file size
    if (file.size > UPLOAD_CONFIG.maxSize) {
      throw new BadRequestException(`File size exceeds ${UPLOAD_CONFIG.maxSize / 1024 / 1024}MB limit`);
    }

    // Validate file format
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    if (!fileExtension || !UPLOAD_CONFIG.allowedFormats.includes(fileExtension)) {
      throw new BadRequestException(
        `Invalid file format. Allowed formats: ${UPLOAD_CONFIG.allowedFormats.join(', ')}`
      );
    }

    try {
      const folderPath = CLOUDINARY_FOLDERS[folder];
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderPath,
        public_id: options?.publicId,
        resource_type: options?.resourceType || 'auto',
        transformation: options?.transformation || UPLOAD_CONFIG.transformations,
        format: fileExtension,
      });

      return {
        url: result.url,
        publicId: result.public_id,
        secureUrl: result.secure_url,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to upload file: ${error.message}`);
    }
  }

  async uploadMultipleFiles(
    files: any[],
    folder: keyof typeof CLOUDINARY_FOLDERS,
    options?: FileUploadOptions
  ): Promise<UploadResult[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadPromises = files.map((file, index) =>
      this.uploadFile(file, folder, {
        ...options,
        publicId: options?.publicId ? `${options.publicId}_${index}` : undefined,
      })
    );

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new BadRequestException(`Failed to upload files: ${error.message}`);
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new BadRequestException(`Failed to delete file: ${error.message}`);
    }
  }

  async deleteMultipleFiles(publicIds: string[]): Promise<void> {
    try {
      await Promise.all(publicIds.map(publicId => this.deleteFile(publicId)));
    } catch (error) {
      throw new BadRequestException(`Failed to delete files: ${error.message}`);
    }
  }

  generatePublicId(baseName: string, folder: keyof typeof CLOUDINARY_FOLDERS): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${CLOUDINARY_FOLDERS[folder]}/${baseName}_${timestamp}_${random}`;
  }

  extractPublicIdFromUrl(url: string): string {
    try {
      const urlParts = url.split('/');
      const publicIdWithExtension = urlParts.slice(-2).join('/');
      return publicIdWithExtension.split('.')[0];
    } catch (error) {
      throw new BadRequestException('Invalid Cloudinary URL');
    }
  }
}
