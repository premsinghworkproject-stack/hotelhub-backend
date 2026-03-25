import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Hotel } from '../../database/models/hotel.model';
import { HotelAmenity } from '../../database/models/hotel-amenity.model';
import { Op } from 'sequelize';

@Injectable()
export class HotelRepository {
  constructor(
    @InjectModel(Hotel)
    private hotelModel: typeof Hotel,
  ) {}

  /**
   * Create a new hotel
   * 
   * @param hotelData - Hotel data
   * @returns Created hotel
   */
  async create(hotelData: Partial<Hotel>): Promise<Hotel> {
    return await this.hotelModel.create(hotelData);
  }

  /**
   * Find hotel by ID
   * 
   * @param id - Hotel ID
   * @returns Hotel or null
   */
  async findById(id: number): Promise<Hotel | null> {
    return await this.hotelModel.findByPk(id);
  }

  /**
   * Find hotels by owner ID
   * 
   * @param ownerId - Owner ID
   * @returns Array of hotels
   */
  /**
   * Search hotels by owner ID with pagination
   * 
   * @param ownerId - Owner ID
   * @param limit - Maximum number of hotels to return
   * @param offset - Number of hotels to skip
   * @returns Array of hotels
   */
  async findByOwnerId(ownerId: number, limit: number = 10, offset: number = 0): Promise<Hotel[]> {
    return await this.hotelModel.findAll({
      where: { ownerId },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
  }

  /**
   * Get all hotels with pagination
   * 
   * @param limit - Maximum number of hotels to return
   * @param offset - Number of hotels to skip
   * @returns Array of hotels with pagination
   */
  async findAll(limit: number = 10, offset: number = 0): Promise<Hotel[]> {
    return await this.hotelModel.findAll({
      limit,
      offset,
      order: [['name', 'ASC']]
    });
  }

  /**
   * Search hotels with comprehensive filters
   * 
   * @param searchInput - Search criteria
   * @returns Array of matching hotels
   */
  async search(searchInput: any): Promise<Hotel[]> {
    const whereConditions: any = {
      isActive: true
    };

    // Full-text search across name, description, address, city
    if (searchInput.searchQuery) {
      whereConditions[Op.or] = [
        { name: { [Op.iLike]: `%${searchInput.searchQuery}%` } },
        { description: { [Op.iLike]: `%${searchInput.searchQuery}%` } },
        { address: { [Op.iLike]: `%${searchInput.searchQuery}%` } },
        { city: { [Op.iLike]: `%${searchInput.city}%` } }
      ];
    }

    // Location filters
    if (searchInput.city) {
      whereConditions.city = { [Op.iLike]: `%${searchInput.city}%` };
    }

    if (searchInput.state) {
      whereConditions.state = { [Op.iLike]: `%${searchInput.state}%` };
    }

    if (searchInput.country) {
      whereConditions.country = { [Op.iLike]: `%${searchInput.country}%` };
    }

    // Rating filters
    if (searchInput.minRating !== undefined) {
      whereConditions.rating = { [Op.gte]: searchInput.minRating };
    }

    if (searchInput.maxRating !== undefined) {
      whereConditions.rating = { 
        ...whereConditions.rating,
        [Op.lte]: searchInput.maxRating 
      };
    }

    // Price filters (filter by minimum room price)
    if (searchInput.minPrice !== undefined) {
      // Join with room types to filter by minimum room price
      whereConditions['$roomTypes.basePrice$'] = { [Op.gte]: searchInput.minPrice };
    }

    if (searchInput.maxPrice !== undefined) {
      // Join with room types to filter by maximum room price
      whereConditions['$roomTypes.basePrice$'] = { [Op.lte]: searchInput.maxPrice };
    }

    // Meal plan filter
    if (searchInput.mealPlan) {
      whereConditions.mealPlan = searchInput.mealPlan;
    }

    // Property type filter
    if (searchInput.propertyType) {
      whereConditions.propertyType = searchInput.propertyType;
    }

    // Amenities filter (if provided as array)
    if (searchInput.amenities && searchInput.amenities.length > 0) {
      // This is complex - would need to filter hotels that have ALL specified amenities
      // For now, we'll implement a simple approach using include
      // In a production system, you might want to use raw SQL for performance
      whereConditions[Op.and] = searchInput.amenities.map(amenity => ({
        ['$amenities.amenity$']: amenity
      }));
    }

    // Guest count filter
    if (searchInput.adults !== undefined) {
      whereConditions.maxOccupancy = { [Op.gte]: searchInput.adults + (searchInput.children || 0) };
    }

    // Date availability filter (simplified - would need room availability checking)
    if (searchInput.checkInDate && searchInput.checkOutDate) {
      whereConditions.createdAt = { [Op.lte]: new Date(searchInput.checkInDate) };
    }

    const queryOptions: any = {
      where: whereConditions,
      order: [['rating', 'DESC'], ['totalReviews', 'DESC']],
    };

    // Add pagination if provided
    if (searchInput.limit !== undefined) {
      queryOptions.limit = searchInput.limit;
    }
    if (searchInput.offset !== undefined) {
      queryOptions.offset = searchInput.offset;
    }

    // Include relationships if needed for filtering
    const include: any[] = [];
    
    if (searchInput.amenities && searchInput.amenities.length > 0) {
      include.push({
        model: HotelAmenity,
        where: {
          amenity: { [Op.in]: searchInput.amenities }
        }
      });
    }

    if (include.length > 0) {
      queryOptions.include = include;
    }

    return await this.hotelModel.findAll(queryOptions);
  }

  /**
   * Update hotel
   * 
   * @param id - Hotel ID
   * @param updateData - Update data
   * @returns Updated hotel
   */
  async update(id: number, updateData: Partial<Hotel>): Promise<Hotel> {
    await this.hotelModel.update(updateData, {
      where: { id }
    });
    return this.findById(id);
  }

  /**
   * Delete hotel
   * 
   * @param id - Hotel ID
   */
  async delete(id: number): Promise<void> {
    await this.hotelModel.destroy({
      where: { id }
    });
  }

  /**
   * Toggle hotel active status
   * 
   * @param id - Hotel ID
   * @param isActive - Active status
   */
  async toggleActiveStatus(id: number, isActive: boolean): Promise<void> {
    await this.update(id, { isActive });
  }

  /**
   * Get hotel count
   * 
   * @returns Number of hotels
   */
  async count(): Promise<number> {
    return await this.hotelModel.count();
  }

  /**
   * Search hotels by name (case-insensitive partial match)
   * 
   * @param name - The search term for hotel name
   * @returns Array of hotels matching search criteria
   */
  async searchByName(name: string): Promise<Hotel[]> {
    return await this.hotelModel.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });
  }

  /**
   * Find hotels near a location (geospatial search)
   * 
   * @param latitude - Latitude
   * @param longitude - Longitude
   * @param radiusKm - Search radius in kilometers
   * @returns Array of nearby hotels
   */
  async findNearby(latitude: number, longitude: number, radiusKm: number = 10): Promise<Hotel[]> {
    // Using Haversine formula approximation with bounding box
    const latDelta = radiusKm / 111; // Approximate km to degrees
    const lonDelta = radiusKm / 111;

    return await this.hotelModel.findAll({
      where: {
        isActive: true,
        latitude: {
          [Op.between]: [latitude - latDelta, latitude + latDelta]
        },
        longitude: {
          [Op.between]: [longitude - lonDelta, longitude + lonDelta]
        }
      },
      order: [['rating', 'DESC']]
    });
  }
}
