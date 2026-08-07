import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    TasksModule,
    UsersModule,
    MongooseModule.forRoot('mongodb://localhost:27017/my_database'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
