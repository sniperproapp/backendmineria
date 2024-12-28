import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './video.entity';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports:[TypeOrmModule.forFeature([Video ])],
  providers: [VideoService,JwtStrategy],
  controllers: [VideoController]
})
export class VideoModule {}
