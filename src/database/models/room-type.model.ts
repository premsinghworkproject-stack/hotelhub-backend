import { Column, Model, DataType, Table, HasMany, BelongsTo } from 'sequelize-typescript';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Hotel } from './hotel.model';
import { Room } from './room.model';
import { RoomTypeAmenity } from './room-type-amenity.model';
import { RoomTypeImage } from './room-type-image.model';

@ObjectType()
@Table({
  tableName: 'room_types',
  timestamps: true,
})
export class RoomType extends Model<RoomType> {
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
  name: string;

  @Field()
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Field()
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  basePrice: number;

  @Field()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  maxOccupancy: number;

  @Field()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  adults: number;

  @Field()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  children: number;

  @Field()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  numberOfBeds: number;

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  bedType?: string; // e.g., "King", "Queen", "Twin", "Bunk"

  @Field()
  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.0,
  })
  roomSize: number; // in square meters or feet

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

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  hasPrivateBathroom: boolean;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  hasKitchen: boolean;

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
  hasSeaView: boolean;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  hasMountainView: boolean;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  hasCityView: boolean;

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
    defaultValue: true,
  })
  isActive: boolean;

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

  @HasMany(() => Room, { foreignKey: 'roomTypeId' })
  rooms: Room[];

  @HasMany(() => RoomTypeAmenity, { foreignKey: 'roomTypeId' })
  amenities: RoomTypeAmenity[];

  @HasMany(() => RoomTypeImage, { foreignKey: 'roomTypeId' })
  images: RoomTypeImage[];
}
