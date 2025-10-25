import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/users/users.module';
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

            // Fires once when the connection is fully opened
            connection.once('open', () => {
              console.log('✅ MongoDB connection open');
            });

            // General driver-connected event (may fire earlier/later depending on topology)
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
    UsersModule,
    CallsModule,
    TwilioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}