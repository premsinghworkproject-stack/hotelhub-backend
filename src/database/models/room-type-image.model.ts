import { Column, Model, DataType, Table, BelongsTo } from 'sequelize-typescript';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { RoomType } from './room-type.model';
import { ImageUrlTransformer } from '../../common/transformers/image-url.transformer';

@ObjectType()
@Table({
  tableName: 'room_type_images',
  timestamps: true,
})
export class RoomTypeImage extends Model<RoomTypeImage> {
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
  get url(): string {
    const rawUrl = this.getDataValue('url');
    return ImageUrlTransformer.transform(rawUrl);
  }
  set url(value: string) {
    this.setDataValue('url', value);
  }

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  altText?: string;

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  caption?: string;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isPrimary: boolean; // Main room type image

  @Field()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  sortOrder: number;

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  publicId?: string; // Cloudinary public ID for deletion

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
  @BelongsTo(() => RoomType, { foreignKey: 'roomTypeId' })
  roomType: RoomType;
}
