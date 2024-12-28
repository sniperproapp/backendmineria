import { Module } from '@nestjs/common';
 
 
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { User } from 'src/users/user.entity';
import { ClaseCursosService } from './Clase_cursos.service';
import { ClaseCursosController } from './ClaseCursos.controller';
import { ClaseCursos } from './ClaseCursos.entity';
 
 
 

@Module({
  imports:[TypeOrmModule.forFeature([ClaseCursos,User]),JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  providers: [ClaseCursosService,JwtStrategy],
  controllers: [ClaseCursosController]
})
export class ClaseCursosModule {}
