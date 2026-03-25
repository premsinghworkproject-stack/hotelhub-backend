import { Column, Model, DataType, Table, BelongsTo, HasMany } from 'sequelize-typescript';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Hotel } from './hotel.model';
import { RoomType } from './room-type.model';
import { Booking } from './booking.model';

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
  OUT_OF_ORDER = 'OUT_OF_ORDER',
  CLEANING = 'CLEANING'
}

@ObjectType()
@Table({
  tableName: 'rooms',
  timestamps: true,
})
export class Room extends Model<Room> {
  @Field(() => ID)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  roomNumber: string;

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  floor?: string;

  @Field(() => RoomStatus)
  @Column({
    type: DataType.ENUM(...Object.values(RoomStatus)),
    allowNull: false,
    defaultValue: RoomStatus.AVAILABLE,
  })
  status: RoomStatus;

  @Field()
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  customPrice?: number; // Override base price from room type if set

  @Field()
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Field()
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes?: string;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isSmokingAllowed: boolean;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isPetFriendly: boolean;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  hasMinibar: boolean;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  hasSafe: boolean;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  hasBalcony: boolean;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  hasBathtub: boolean;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  hasShower: boolean;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  hasKitchenette: boolean;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  hasWorkDesk: boolean;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  hasTV: boolean;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  hasWiFi: boolean;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  hasAirConditioning: boolean;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  hasHeating: boolean;

  @Field(() => ID)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: 'hotels',
      key: 'id',
    },
  })
  hotelId: number;

  @Field(() => ID)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: 'room_types',
      key: 'id',
    },
  })
  roomTypeId: number;

  @Field(() => Date)
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @Field(() => Date)
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updatedAt: Date;

  // Relationships
  @BelongsTo(() => Hotel, { foreignKey: 'hotelId' })
  hotel: Hotel;

  @BelongsTo(() => RoomType, { foreignKey: 'roomTypeId' })
  roomType: RoomType;

  @HasMany(() => Booking, { foreignKey: 'roomId' })
  bookings: Booking[];
}
