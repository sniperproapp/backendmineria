import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
 
 
import { Zoom } from './zoom.entity';
import { ZoomController } from './zoom.controller';
import { ZoomService } from './zoom.service';

@Module({
  imports:[TypeOrmModule.forFeature([Zoom ])],
  providers: [ZoomService,JwtStrategy],
  controllers: [ZoomController]
})
export class ZoomModule {}
