import { Module } from '@nestjs/common';
 
 
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { User } from 'src/users/user.entity';
 
import { BscscanService } from './bscscan.service';
import { BscscanController } from './BscscanController.controller';

@Module({exports:[BscscanService],
  imports:[ JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  providers: [BscscanService,JwtStrategy],
  controllers: [BscscanController]
})
export class BscscanModule {}
