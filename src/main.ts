import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan'
import { CORS } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('env'));
  app.enableCors(CORS)
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({forbidUnknownValues: false}));
  const port = app.get(ConfigService)
   
   
  await app.listen(port.get('PORT'));
  console.log(`Aplication running on: ${await app.getUrl()}`)
   
}
bootstrap();
