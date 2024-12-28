import { Module } from '@nestjs/common';
 
 
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { User } from 'src/users/user.entity';
 
import { CuponCursos     } from './cuponCursos.entity';
import { cuponCursosService } from './cupon_cursos.service';
import { cuponCursosController } from './cuponCursos.controller';
 
 
 

@Module({
  imports:[TypeOrmModule.forFeature([CuponCursos,User]),JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  providers: [cuponCursosService,JwtStrategy],
  controllers: [cuponCursosController]
})
export class cuponCursosModule {}
