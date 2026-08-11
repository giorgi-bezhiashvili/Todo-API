import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'; // Added missing import
import { Model } from 'mongoose'; // Added missing import
import { CreateAuthDto } from './dto/create-auth.dto';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import {
  RefreshToken,
  RefreshTokenDocument,
} from '../schemas/refreshToken.schema';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    private jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto): Promise<User> {
    const saltRounds = 12;
    createAuthDto.password = await bcrypt.hash(
      createAuthDto.password,
      saltRounds,
    );
    const newUser = new this.userModel({
      ...createAuthDto,
    });
    return await newUser.save();
  }
  async validateUser(
    identifier: string,
    password: string,
  ): Promise<UserDocument | null> {
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
    accessToken?: string;
    refreshToken?: string;
  }> {
    const user = await this.validateUser(
      loginAuthDto.identifier,
      loginAuthDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      username: user.username,
      sub: user._id?.toString(),
      email: user.email,
    };

    // Sign Access Token using default secret or explicit options
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET || 'fallback_access_secret',
    });

    // Sign Refresh Token using the unique refreshTokenSecret
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret',
      expiresIn: '7d',
    });
    const refreshTokenDocument = new this.refreshTokenModel({
      token: refreshToken,
      userId: user._id,
    });
    await refreshTokenDocument.save();
    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
    };
  }

  async findOne(id: string): Promise<UserDocument> {
    // Finds a single user by their MongoDB _id
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async remove(id: string): Promise<User> {
    // Deletes the user from the database
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found to delete`);
    }
    return deletedUser;
  }
  async token(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException(
        `User with ID ${userId} not found for token generation`,
      );
    }
    const payload = {
      username: user.username,
      sub: user._id,
      email: user.email,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET || 'fallback_access_secret',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret',
      expiresIn: '7d',
    });
    const refreshTokenDocument = new this.refreshTokenModel({
      token: refreshToken,
      userId: userId,
    });
    await refreshTokenDocument.save();
    return { accessToken, refreshToken };
  }
}
