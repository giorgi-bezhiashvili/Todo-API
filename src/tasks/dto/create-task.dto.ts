import { IsDate, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title!: string;

  @IsString()
  taskDescription!: string;

  @IsDate()
  dueDate!: Date;

  @IsDate()
  startDate!: Date;
}
