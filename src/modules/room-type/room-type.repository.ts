import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RoomType } from '../../database/models/room-type.model';
import { Op } from 'sequelize';

@Injectable()
export class RoomTypeRepository {
  constructor(
    @InjectModel(RoomType)
    private roomTypeModel: typeof RoomType,
  ) {}

  /**
   * Create a new room type
   * 
   * @param roomTypeData - Room type data
   * @returns Created room type
   */
  async create(roomTypeData: Partial<RoomType>): Promise<RoomType> {
    return await this.roomTypeModel.create(roomTypeData);
  }

  /**
   * Find room type by ID
   * 
   * @param id - Room type ID
   * @returns Room type or null
   */
  async findById(id: number): Promise<RoomType | null> {
    return await this.roomTypeModel.findByPk(id);
  }

  /**
   * Find room types by hotel ID
   * 
   * @param hotelId - Hotel ID
   * @returns Array of room types
   */
  async findByHotelId(hotelId: number): Promise<RoomType[]> {
    return await this.roomTypeModel.findAll({
      where: { hotelId },
      order: [['name', 'ASC']]
    });
  }

  /**
   * Search room types with filters
   * 
   * @param searchInput - Search criteria
   * @returns Array of matching room types
   */
  async search(searchInput: any): Promise<RoomType[]> {
    const whereConditions: any = {
      isActive: true
    };

    // Hotel filter
    if (searchInput.hotelId) {
      whereConditions.hotelId = searchInput.hotelId;
    }

    // Name filter
    if (searchInput.name) {
      whereConditions.name = { [Op.iLike]: `%${searchInput.name}%` };
    }

    // Price range filter
    if (searchInput.minPrice !== undefined) {
      whereConditions.basePrice = { [Op.gte]: searchInput.minPrice };
    }

    if (searchInput.maxPrice !== undefined) {
      whereConditions.basePrice = { 
        ...whereConditions.basePrice,
        [Op.lte]: searchInput.maxPrice 
      };
    }

    // Occupancy filter
    if (searchInput.maxOccupancy !== undefined) {
      whereConditions.maxOccupancy = { [Op.gte]: searchInput.maxOccupancy };
    }

    // Amenities filter
    if (searchInput.amenities && searchInput.amenities.length > 0) {
      whereConditions.amenities = { [Op.contains]: searchInput.amenities };
    }

    return await this.roomTypeModel.findAll({
      where: whereConditions,
      order: [['basePrice', 'ASC']],
      limit: searchInput.limit || 20,
      offset: searchInput.offset || 0
    });
  }

  /**
   * Update room type
   * 
   * @param id - Room type ID
   * @param updateData - Update data
   * @returns Updated room type
   */
  async update(id: number, updateData: Partial<RoomType>): Promise<RoomType> {
    await this.roomTypeModel.update(updateData, {
      where: { id }
    });
    return this.findById(id);
  }

  /**
   * Delete room type
   * 
   * @param id - Room type ID
   */
  async delete(id: number): Promise<void> {
    await this.roomTypeModel.destroy({
      where: { id }
    });
  }

  /**
   * Get room type count
   * 
   * @returns Number of room types
   */
  async count(): Promise<number> {
    return await this.roomTypeModel.count();
  }
}
