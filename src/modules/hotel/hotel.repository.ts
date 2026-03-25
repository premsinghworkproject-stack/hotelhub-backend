import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Hotel } from '../../database/models/hotel.model';
import { Op } from 'sequelize';

@Injectable()
export class HotelRepository {
  constructor(
    @InjectModel(Hotel)
    private hotelModel: typeof Hotel,
  ) {}

  async create(createHotelDto: Partial<Hotel>): Promise<Hotel> {
    return this.hotelModel.create(createHotelDto);
  }

  async findById(id: number): Promise<Hotel | null> {
    return this.hotelModel.findByPk(id);
  }

  async findAll(limit: number = 10, offset: number = 0): Promise<Hotel[]> {
    return this.hotelModel.findAll({
      limit,
      offset,
      order: [['name', 'ASC']],
    });
  }

  async searchByName(name: string): Promise<Hotel[]> {
    return this.hotelModel.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });
  }

  async count(): Promise<number> {
    return this.hotelModel.count();
  }
}
