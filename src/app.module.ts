import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CallsModule } from 'src/calls/calls.module';
import { TwilioModule } from 'src/twilio/twilio.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('MONGO_URI');
        console.log('Using Mongo URI:', uri);

        return {
          uri,
          serverSelectionTimeoutMS: 5000,
          connectionFactory: (connection) => {
            const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
            console.log('Mongo readyState at boot:', states[connection.readyState] ?? connection.readyState);

            connection.once('open', () => {
              console.log('✅ MongoDB connection open');
            });

            connection.on('connected', () => {
              console.log('✅ MongoDB driver reported connected');
            });

            connection.on('error', (error) => {
              console.log('❌ MongoDB connection error:', error.message);
            });

            connection.on('disconnected', () => {
              console.log('⚠️ MongoDB disconnected');
            });

            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
    CallsModule,
    TwilioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}