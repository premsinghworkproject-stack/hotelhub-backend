import { Column, Model, DataType, Table, HasMany } from 'sequelize-typescript';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Booking } from './booking.model';

@ObjectType()
@Table({
  tableName: 'hotels',
  timestamps: true,
})
export class Hotel extends Model<Hotel> {
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
    type: DataType.STRING,
    allowNull: false,
  })
  location: string;

  @Field()
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;

  @Field()
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @Field()
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updatedAt: Date;

  @HasMany(() => Booking, { foreignKey: 'hotelId' })
  bookings: Booking[];
}
