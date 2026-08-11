import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type UrlDocument = Url & Document;

@Schema({ timestamps: true })
export class Url {
  _id: Types.ObjectId;

  @Prop({ default: '' })
  title: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true, unique: true, index: true })
  shortCode: string;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
