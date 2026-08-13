import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { Tasks, TaskDocument } from '../schemas/tasks.schema';
import { Model } from 'mongoose';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Tasks.name) private userModel: Model<TaskDocument>,
  ) {}
  async create(userId: string, createTaskDto: CreateTaskDto) {
    const newTask = new this.userModel({
      ...createTaskDto,
      userId,
    });
    return await newTask.save();
  }
}
