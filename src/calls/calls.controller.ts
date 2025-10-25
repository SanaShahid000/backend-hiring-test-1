import { Controller, Get, Query } from '@nestjs/common';
import { CallsService } from './calls.service';

@Controller('calls')
export class CallsController {
  constructor(private readonly calls: CallsService) {}

  @Get()
  list(@Query('limit') limit?: string) {
    return this.calls.list(Number(limit) || 50);
  }
}