import { Column, Model, DataType, Table, HasMany } from 'sequelize-typescript';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Booking } from './booking.model';
import { OTP } from './otp.model';

@ObjectType()
@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<User> {
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
    unique: true,
  })
  email: string;

  @Field(() => String, { nullable: true })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password?: string;

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

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isEmailVerified: boolean;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isDeleted: boolean;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @Field(() => Date, { nullable: true })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  emailVerifiedAt?: Date;

  @Field(() => Date, { nullable: true })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deletedAt?: Date;

  @HasMany(() => Booking, { foreignKey: 'userId' })
  bookings: Booking[];

  @HasMany(() => OTP, { foreignKey: 'userId' })
  otps: OTP[];
}
