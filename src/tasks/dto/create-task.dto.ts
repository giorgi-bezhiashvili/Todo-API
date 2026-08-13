import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  description!: string;

  @IsDate()
  dueDate!: Date;

  @IsDate()
  startDate!: Date;

  @IsBoolean()
  done!: boolean;
}
