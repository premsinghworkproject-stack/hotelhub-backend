import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { Room } from '../../database/models/room.model';
import { RoomImage } from '../../database/models/room-image.model';
import { RoomRepository } from './room.repository';
import { CreateRoomWithImagesInput, UpdateRoomWithImagesInput } from './dto/room-with-images.input';
import { FileUploadService } from '../../common/services/file-upload.service';
import { HotelRepository } from '../hotel/hotel.repository';
import { RoomTypeRepository } from '../room-type/room-type.repository';

@Injectable()
export class RoomWithImagesService {
  constructor(
    private readonly roomRepository: RoomRepository,
    @Inject(forwardRef(() => HotelRepository))
    private readonly hotelRepository: HotelRepository,
    @Inject(forwardRef(() => RoomTypeRepository))
    private readonly roomTypeRepository: RoomTypeRepository,
    private readonly fileUploadService: FileUploadService
  ) {}

  async createWithImages(createRoomInput: CreateRoomWithImagesInput, ownerId: number): Promise<Room> {
    try {
      // Verify hotel ownership
      const hotel = await this.hotelRepository.findById(createRoomInput.hotelId);
      if (!hotel) {
        throw new NotFoundException('Hotel not found');
      }
      if (hotel.ownerId !== ownerId) {
        throw new ForbiddenException('You can only create rooms for your own hotels');
      }

      // Verify room type belongs to the hotel
      const roomType = await this.roomTypeRepository.findById(createRoomInput.roomTypeId);
      if (!roomType || roomType.hotelId !== createRoomInput.hotelId) {
        throw new NotFoundException('Room type not found or does not belong to this hotel');
      }

      // Create room first
      const { images, ...roomData } = createRoomInput;
      const room = await this.roomRepository.create(roomData);

      // Handle image uploads if provided
      if (images && images.files && images.files.length > 0) {
        await this.uploadRoomImages(room.id, images.files, images.imageData);
      }

      // Return room with images
      return this.roomRepository.findById(room.id);
    } catch (error) {
      throw new GraphQLError(`Failed to create room with images: ${error.message}`, {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  async updateWithImages(roomId: number, updateRoomInput: UpdateRoomWithImagesInput, ownerId: number): Promise<Room> {
    try {
      // Check if user owns the room's hotel
      const existingRoom = await this.roomRepository.findById(roomId);
      if (!existingRoom) {
        throw new NotFoundException('Room not found');
      }

      const hotel = await this.hotelRepository.findById(existingRoom.hotelId);
      if (hotel.ownerId !== ownerId) {
        throw new ForbiddenException('You can only update rooms for your own hotels');
      }

      // Handle new image uploads
      if (updateRoomInput.newImages && updateRoomInput.newImages.files && updateRoomInput.newImages.files.length > 0) {
        await this.uploadRoomImages(roomId, updateRoomInput.newImages.files, updateRoomInput.newImages.imageData);
      }

      // Handle image deletions
      if (updateRoomInput.deleteImageIds && updateRoomInput.deleteImageIds.length > 0) {
        await this.deleteRoomImages(updateRoomInput.deleteImageIds);
      }

      // Update room data
      const { newImages, deleteImageIds, ...roomData } = updateRoomInput;
      const updatedRoom = await this.roomRepository.update(roomId, roomData);
      
      // Return room with images
      return this.roomRepository.findById(roomId);
    } catch (error) {
      throw new GraphQLError(`Failed to update room with images: ${error.message}`, {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  private async uploadRoomImages(roomId: number, files: any[], imageData?: any[]): Promise<void> {
    try {
      // Upload files to Cloudinary
      const uploadResults = await this.fileUploadService.uploadMultipleFiles(
        files,
        'ROOMS'
      );

      // Create image records in database
      const imagePromises = uploadResults.map(async (result, index) => {
        const imageInfo = imageData?.[index] || {};
        const publicId = this.fileUploadService.extractPublicIdFromUrl(result.url);
        
        return RoomImage.create({
          roomId,
          url: result.secureUrl,
          altText: imageInfo.altText,
          caption: imageInfo.caption,
          isPrimary: imageInfo.isPrimary || false,
          sortOrder: imageInfo.sortOrder || index,
          publicId,
        });
      });

      await Promise.all(imagePromises);

      // Ensure only one primary image
      await this.ensureSinglePrimaryImage(roomId);
    } catch (error) {
      throw new GraphQLError(`Failed to upload room images: ${error.message}`, {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  private async deleteRoomImages(imageIds: number[]): Promise<void> {
    try {
      // Get images to delete
      const images = await RoomImage.findAll({
        where: { id: imageIds }
      });

      // Delete from Cloudinary
      const publicIds = images
        .filter(img => img.publicId)
        .map(img => img.publicId);

      if (publicIds.length > 0) {
        await this.fileUploadService.deleteMultipleFiles(publicIds);
      }

      // Delete from database
      await RoomImage.destroy({
        where: { id: imageIds }
      });
    } catch (error) {
      throw new GraphQLError(`Failed to delete room images: ${error.message}`, {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  private async ensureSinglePrimaryImage(roomId: number): Promise<void> {
    try {
      // Find all primary images
      const primaryImages = await RoomImage.findAll({
        where: { roomId, isPrimary: true }
      });

      // If multiple primary images, keep only the first one
      if (primaryImages.length > 1) {
        const toUpdate = primaryImages.slice(1);
        await Promise.all(
          toUpdate.map(img => img.update({ isPrimary: false }))
        );
      }

      // If no primary image, set the first image as primary
      if (primaryImages.length === 0) {
        const firstImage = await RoomImage.findOne({
          where: { roomId },
          order: [['sortOrder', 'ASC']]
        });

        if (firstImage) {
          await firstImage.update({ isPrimary: true });
        }
      }
    } catch (error) {
      console.error('Error ensuring single primary image:', error);
    }
  }
}
