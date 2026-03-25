import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../database/models/user.model';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserRepository } from './user.repository';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UserService, UserResolver, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
