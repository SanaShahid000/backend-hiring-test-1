import { Body, Controller, Headers, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { TwilioService } from './twilio.service';
import { CallsService } from '../calls/calls.service';

@Controller('twilio')
export class TwilioController {
  constructor(private twilio: TwilioService, private calls: CallsService) {}

  @Post('voice')
  async receiveCall(@Body() body: any, @Res() res: Response) {
    const from = body.From;
    const to = body.To;

    await this.calls.logIncoming({
      sid: body.CallSid,
      from,
      to,
      status: 'initiated',
      direction: 'inbound',
    });

    res.type('text/xml').status(200).send(this.twilio.buildIvrMenu());
  }

  @Post('gather')
  async handleGather(@Body() body: any, @Res() res: Response) {
    const digit = body.Digits;
    const sid = body.CallSid;
    await this.calls.updateBySid(sid, { digitsSelected: digit });

    const forwardTo = process.env.FORWARD_TO_NUMBER;
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

    if (digit === '1' && forwardTo && twilioNumber) {
      await this.calls.updateBySid(sid, { status: 'in-progress' });
      res.type('text/xml').status(200).send(this.twilio.buildForwardResponse(twilioNumber, forwardTo));
    } else if (digit === '2') {
      await this.calls.updateBySid(sid, { status: 'voicemail' });
      res.type('text/xml').status(200).send(this.twilio.buildVoicemailRecord());
    } else {
      const xml = this.twilio.buildIvrMenu();
      res.type('text/xml').status(200).send(xml);
    }
  }

  @Post('dial-complete')
  async dialComplete(@Body() body: any, @Res() res: Response) {
    const sid = body.CallSid;
    const status = body.DialCallStatus || 'completed';
    const duration = Number(body.DialCallDuration || 0);
    await this.calls.updateBySid(sid, { status, duration });
    res.status(200).send('OK');
  }

  @Post('recording-complete')
  async recordingComplete(@Body() body: any, @Res() res: Response) {
    const sid = body.CallSid;
    const url = body.RecordingUrl;
    const recordingSid = body.RecordingSid;
    await this.calls.updateBySid(sid, { voicemailUrl: url, recordingSid });
    res.status(200).send('OK');
  }
}