import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema()
export class RefreshToken {
  @Prop({ required: true, unique: true })
  token!: string;

  @Prop({ required: true })
  userId!: string;

  @Prop({ default: Date.now, expires: 604800 }) // 7 days in seconds (7 * 24 * 60 * 60)
  createdAt!: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
