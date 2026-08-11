import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema()
export class RefreshToken {
  @Prop({ required: true, unique: true })
  token!: string;

  @Prop({ required: true })
  userId!: string;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
