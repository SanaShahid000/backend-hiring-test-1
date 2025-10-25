import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CallDocument = HydratedDocument<Call>;

@Schema({ timestamps: true })
export class Call {
  @Prop({ index: true })
  sid: string; // Twilio CallSid

  @Prop()
  from: string;

  @Prop()
  to: string;

  @Prop({ default: 'initiated' })
  status: string; // initiated | in-progress | completed | voicemail | failed

  @Prop()
  duration: number; // seconds

  @Prop()
  digitsSelected: string; // '1' or '2'

  @Prop()
  direction: string; // inbound/outbound

  @Prop()
  voicemailUrl: string; // Recording URL

  @Prop()
  recordingSid: string;
}

export const CallSchema = SchemaFactory.createForClass(Call);