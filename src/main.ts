import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  // Ensure the port is taken from Heroku's PORT environment variable
  const port = process.env.PORT || configService.get<number>('PORT') || 5000;

  // Enable CORS for all origins
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Trust proxy headers (important for Heroku)
  app.set('trust proxy', 1);

  await app.listen(port);
}
bootstrap();
