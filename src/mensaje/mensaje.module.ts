import { Module } from '@nestjs/common';
 
 
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { Category } from 'src/categories/category.entity';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { User } from 'src/users/user.entity';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { JwtModule } from '@nestjs/jwt';
import { MensajeController } from './mensaje.controller';
import { MensajeService } from './mensaje.service';

@Module({
  imports:[TypeOrmModule.forFeature([ User  ]),JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  controllers: [MensajeController],
  providers: [MensajeService,JwtStrategy]
})
export class MensajeModule {}
