import { Column, Model, DataType, Table, BelongsTo } from 'sequelize-typescript';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Room } from './room.model';
import { ImageUrlTransformer } from '../../common/transformers/image-url.transformer';

@ObjectType()
@Table({
  tableName: 'room_images',
  timestamps: true,
})
export class RoomImage extends Model<RoomImage> {
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
  isPrimary: boolean; // Main room image

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
      model: 'rooms',
      key: 'id',
    },
  })
  roomId: number;

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
  @BelongsTo(() => Room, { foreignKey: 'roomId' })
  room: Room;
}
