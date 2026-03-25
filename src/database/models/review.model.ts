import { Column, Model, DataType, Table, BelongsTo } from 'sequelize-typescript';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Hotel } from './hotel.model';
import { User } from './user.model';

@ObjectType()
@Table({
  tableName: 'reviews',
  timestamps: true,
})
export class Review extends Model<Review> {
  @Field(() => ID)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Field()
  @Column({
    type: DataType.DECIMAL(3, 2),
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  })
  rating: number; // 1-5 star rating

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Field()
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  comment?: string;

  // Individual rating categories
  @Field()
  @Column({
    type: DataType.DECIMAL(3, 2),
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  })
  cleanlinessRating?: number;

  @Field()
  @Column({
    type: DataType.DECIMAL(3, 2),
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  })
  serviceRating?: number;

  @Field()
  @Column({
    type: DataType.DECIMAL(3, 2),
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  })
  locationRating?: number;

  @Field()
  @Column({
    type: DataType.DECIMAL(3, 2),
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  })
  valueRating?: number;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isVerified: boolean; // Verified stay

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isVisible: boolean; // Show to public

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
      model: 'users',
      key: 'id',
    },
  })
  userId: number;

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

  @BelongsTo(() => User, { foreignKey: 'userId' })
  user: User;
}
