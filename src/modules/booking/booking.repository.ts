import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Booking } from '../../database/models/booking.model';
import { CreateBookingInput } from './dto/create-booking.input';
import { Op } from 'sequelize';

@Injectable()
export class BookingRepository {
  constructor(
    @InjectModel(Booking)
    private bookingModel: typeof Booking,
  ) {}

  async create(createBookingDto: CreateBookingInput): Promise<Booking> {
    return this.bookingModel.create({
      userId: createBookingDto.userId,
      hotelId: createBookingDto.hotelId,
      checkIn: createBookingDto.checkIn,
      checkOut: createBookingDto.checkOut,
    });
  }

  async findById(id: number): Promise<Booking | null> {
    return this.bookingModel.findByPk(id, {
      include: ['user', 'hotel'],
    });
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingModel.findAll({
      include: ['user', 'hotel'],
      order: [['createdAt', 'DESC']],
    });
  }

  async findByUserId(userId: number): Promise<Booking[]> {
    return this.bookingModel.findAll({
      where: { userId },
      include: ['user', 'hotel'],
      order: [['createdAt', 'DESC']],
    });
  }

  async findByHotelId(hotelId: number): Promise<Booking[]> {
    return this.bookingModel.findAll({
      where: { hotelId },
      include: ['user', 'hotel'],
      order: [['createdAt', 'DESC']],
    });
  }

  async findOverlappingBookings(
    hotelId: number,
    checkIn: Date,
    checkOut: Date,
  ): Promise<Booking[]> {
    return this.bookingModel.findAll({
      where: {
        hotelId,
        [Op.or]: [
          {
            checkIn: {
              [Op.between]: [checkIn, checkOut],
            },
          },
          {
            checkOut: {
              [Op.between]: [checkIn, checkOut],
            },
          },
          {
            [Op.and]: [
              {
                checkIn: {
                  [Op.lte]: checkIn,
                },
              },
              {
                checkOut: {
                  [Op.gte]: checkOut,
                },
              },
            ],
          },
        ],
      },
    });
  }
}
