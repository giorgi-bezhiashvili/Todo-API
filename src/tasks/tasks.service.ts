import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class TasksService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(userId: string, createTaskDto: CreateTaskDto) {
    const newTask = {
      ...createTaskDto,
      createdAt: new Date(),
    };
    const user = await this.userModel
      .findByIdAndUpdate(userId, {
        $push: { tasks: newTask },
      })
      .exec();
    if (!user) {
      throw new Error('User not found');
    }
    return newTask;
  }

  async findAll(userId: string) {
    const tasks = await this.userModel
      .findById(userId)
      .populate(`tasks`)
      .exec();
    if (!tasks) {
      throw new Error('Couldnt find tasks for the user');
    }
    return tasks;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
