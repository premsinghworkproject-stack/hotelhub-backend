import { Column, Model, DataType, Table, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { User } from './user.model';

@ObjectType()
@Table({
  tableName: 'otps',
  timestamps: true,
  indexes: [
    {
      fields: ['email'],
      name: 'otps_email_index',
    },
    {
      fields: ['expiresAt'],
      name: 'otps_expiresAt_index',
    },
    {
      fields: ['email', 'isVerified'],
      name: 'otps_email_verified_index',
    },
  ],
})
export class OTP extends Model<OTP> {
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
  email: string;

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  otp: string;

  @Field()
  @Column({
    type: DataType.ENUM('EMAIL_VERIFICATION', 'PASSWORD_RESET'),
    allowNull: false,
    defaultValue: 'EMAIL_VERIFICATION',
  })
  type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET';

  @Field(() => Int)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  attempts: number;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isVerified: boolean;

  @Field()
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiresAt: Date;

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

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  userId?: number;

  @BelongsTo(() => User)
  user?: User;
}
