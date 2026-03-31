import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../database/models/user.model';
import { CreateUserInput } from './dto/create-user.input';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserInput): Promise<User> {
    console.log('UserRepository.create called with:', {
      name: createUserDto.name,
      email: createUserDto.email,
      passwordLength: createUserDto.password?.length,
      hasPassword: !!createUserDto.password,
      userType: createUserDto.userType,
      companyName: createUserDto.companyName
    });
    
    const user = await this.userModel.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      userType: createUserDto.userType,
      companyName: createUserDto.companyName,
    });
    
    console.log('User created with:', {
      id: user.id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      companyName: user.companyName,
      hasPassword: !!user.password
    });
    
    return user;
  }

  async findById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    return await user.update(updateData);
  }
}
