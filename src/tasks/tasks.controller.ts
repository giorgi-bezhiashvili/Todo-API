import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@User('userId') userId: string, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(userId, createTaskDto);
  }
}
