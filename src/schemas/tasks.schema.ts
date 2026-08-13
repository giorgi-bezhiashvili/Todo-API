import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Tasks>;

@Schema()
export class Tasks {
  @Prop({ required: true, unique: true })
  title!: string;

  @Prop()
  description!: string;

  @Prop({ default: false })
  done!: boolean;

  @Prop({ default: Date.now })
  dueDate!: Date;

  @Prop()
  startDate!: Date;
}

export const TasksSchema = SchemaFactory.createForClass(Tasks);
