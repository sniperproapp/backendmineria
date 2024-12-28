import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('env'));
  const cors = require('cors');
  app.use(cors()); 
  app.useGlobalPipes(new ValidationPipe({forbidUnknownValues: false}));
   const port = app.get(ConfigService)
   
  const newLocal = "0.0.0.0";
  await app.listen("4001",newLocal || 'localhost');
  console.log(`Aplication running on: ${await app.getUrl()}`)
   
}
bootstrap();
