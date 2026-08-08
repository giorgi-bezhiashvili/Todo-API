import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'; // Added missing import
import { Model } from 'mongoose'; // Added missing import
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createAuthDto: CreateAuthDto): Promise<User> {
    const saltRounds = 12;
    createAuthDto.password = await bcrypt.hash(
      createAuthDto.password,
      saltRounds,
    );
    const newUser = new this.userModel({
      ...createAuthDto,
      password: createAuthDto.password,
    });
    return await newUser.save();
  }
  async validateUser(
    identifier: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }
    return user;
  }
  async login(loginAuthDto: LoginAuthDto): Promise<{
    message: string;
    user: { id: string; username: string; email: string };
  }> {
    const user = await this.validateUser(
      loginAuthDto.identifier,
      loginAuthDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      message: 'Login successful',
      user: {
        id: (user as UserDocument)._id.toString(),
        username: user.username,
        email: user.email,
      },
    };
  }

  async findOne(id: string): Promise<User> {
    // Finds a single user by their MongoDB _id
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateAuthDto: UpdateAuthDto): Promise<User> {
    // Updates the user and returns the newly updated document ({ new: true })
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateAuthDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found to update`);
    }
    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    // Deletes the user from the database
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found to delete`);
    }
    return deletedUser;
  }
}
