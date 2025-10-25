import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Health check: returns "connected" when Mongo is online
  @Get('db-health')
  dbHealth() {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    return {
      state: states[this.connection.readyState] || `code:${this.connection.readyState}`,
    };
  }
}