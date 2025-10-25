import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CallDocument = HydratedDocument<Call>;

@Schema({ timestamps: true })
export class Call {
  @Prop({ index: true })
  sid: string;

  @Prop()
  from: string;

  @Prop()
  to: string;

  @Prop({ default: 'initiated' })
  status: string;

  @Prop()
  duration: number;

  @Prop()
  digitsSelected: string;

  @Prop()
  direction: string;

  @Prop()
  voicemailUrl: string;

  @Prop()
  recordingSid: string;
}

export const CallSchema = SchemaFactory.createForClass(Call);