import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';

@Injectable()
export class TwilioService {
  buildIvrMenu() {
    const vr = new Twilio.twiml.VoiceResponse();
    const gather = vr.gather({
      numDigits: 1,
      action: '/twilio/gather',
      method: 'POST',
      timeout: 5,
    });
    gather.say('Welcome. Press 1 to be connected. Press 2 to leave a voicemail.');
    vr.say('We did not receive any input. Goodbye.');
    return vr.toString();
  }
  buildForwardResponse(twilioNumber: string, forwardTo: string) {
    const vr = new Twilio.twiml.VoiceResponse();
    const dial = vr.dial({
      callerId: twilioNumber,
      record: 'record-from-answer',
      action: '/twilio/dial-complete',
    });
    dial.number(forwardTo);
    return vr.toString();
  }

  buildVoicemailRecord() {
    const vr = new Twilio.twiml.VoiceResponse();
    vr.say('Please leave a message after the beep. Press pound to finish.');
    vr.record({
      action: '/twilio/recording-complete',
      method: 'POST',
      finishOnKey: '#',
      maxLength: 120,
      playBeep: true,
    });
    return vr.toString();
  }
}