import { Module } from '@nestjs/common';
 
 
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { User } from 'src/users/user.entity';
import { DescuentoCursos } from './descuentoCursos.entity';
import { descuentoCursosController } from './descuentoCursos.controller';
import { descuentoCursosService } from './descuento_cursos.service';
import { Cursos } from 'src/cursos/Cursos.entity';
import { Reviews } from 'src/reviews/reviews.entity';
import { Cursostudent } from 'src/studentcurso/Cursostudent.entity';
 
 
 
 

@Module({
  imports:[TypeOrmModule.forFeature([DescuentoCursos,Cursos,Cursostudent,
    Reviews]),JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  providers: [descuentoCursosService,JwtStrategy],
  controllers: [descuentoCursosController]
})
export class descuentoCursosModule {}
