/* eslint-disable @typescript-eslint/no-unsafe-call */

import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  username!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  password!: string;

  @IsEmail()
  email!: string;
}
