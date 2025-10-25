import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Call, CallDocument } from './schemas/call.schema';

@Injectable()
export class CallsService {
  constructor(@InjectModel(Call.name) private callModel: Model<CallDocument>) {}

  async logIncoming(payload: Partial<Call>) {
    const doc = new this.callModel(payload);
    return doc.save();
  }

  async updateBySid(sid: string, update: Partial<Call>) {
    return this.callModel.findOneAndUpdate({ sid }, update, { new: true });
  }

  async findBySid(sid: string) {
    return this.callModel.findOne({ sid }).lean();
  }

  async list(limit = 50) {
    return this.callModel.find().sort({ createdAt: -1 }).limit(limit).lean();
  }
}