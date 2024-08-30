import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, IUser } from './schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
  ) {}

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const { username, password, role } = createUserDto;

    // Check if the user already exists
    const existingUser = await this.userModel.findOne({ username }).exec();
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = new this.userModel({
      username,
      password,
      role,
    });

    return newUser.save();
  }

  // Update an existing user
  async update(userId: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.role) {
      user.role = updateUserDto.role;
    }

    user.password = updateUserDto.password || user.password;

    return user.save();
  }

  // Find a user by username
  async findByUsername(username: string): Promise<IUser> {
    return this.userModel.findOne({ username }).exec();
  }

  // Find a user by ID
  async findById(userId: string): Promise<IUser> {
    return this.userModel.findById(userId).exec();
  }

  // Delete a user (optional)
  async delete(userId: string): Promise<IUser> {
    const user = await this.userModel.findByIdAndDelete(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // List all users (optional)
  async findAll(): Promise<IUser[]> {
    return this.userModel.find().exec();
  }
}
