import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseModule } from './firebase/firebase.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoggerModule } from 'nestjs-pino';
import { CustomLogger } from './custom.logger';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'ventix123',
      database: 'firebase_auth',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule.forRoot(),
    UsersModule,
    AuthModule,
    LoggerModule.forRoot({ pinoHttp: { level: 'trace' } }),
  ],
  controllers: [AppController],
  providers: [AppService, CustomLogger],
  exports: [CustomLogger],
})
export class AppModule {}
