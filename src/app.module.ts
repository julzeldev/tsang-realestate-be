import { Module } from '@nestjs/common';
// import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { PropertyScraperModule } from './modules/property-scraper/propertyScraper.module';
import { ClientsModule } from './modules/clients/clients.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration globally available
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'), // gets the MongoDB URI from the environment variables (.env or .env.local)
        dbName: 'TsangRealStateDB',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    PropertiesModule,
    PropertyScraperModule,
    ClientsModule,
  ],
  controllers: [AppController],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    AppService,
  ],
})
export class AppModule {}
