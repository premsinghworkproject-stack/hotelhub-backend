import { Column, Model, DataType, Table, BelongsTo, HasMany } from 'sequelize-typescript';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { User } from './user.model';
import { Hotel } from './hotel.model';

@ObjectType()
@Table({
  tableName: 'bookings',
  timestamps: true,
})
export class Booking extends Model<Booking> {
  @Field(() => ID)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Field(() => ID)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Field(() => ID)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  hotelId: number;

  @Field()
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  checkIn: Date;

  @Field()
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  checkOut: Date;

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

  @Field(() => User)
  @BelongsTo(() => User, { foreignKey: 'userId' })
  user: User;

  @Field(() => Hotel)
  @BelongsTo(() => Hotel, { foreignKey: 'hotelId' })
  hotel: Hotel;
}
