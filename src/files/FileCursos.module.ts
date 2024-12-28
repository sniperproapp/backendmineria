import { Module } from '@nestjs/common';
 
 
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { User } from 'src/users/user.entity';
import { FileCursosService } from './File_cursos.service';
import { FileCursosController } from './FileCursos.controller';
import { FileCursos } from './FileCursos.entity';
 
 
 
 

@Module({
  imports:[TypeOrmModule.forFeature([FileCursos,User]),JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  providers: [FileCursosService,JwtStrategy],
  controllers: [FileCursosController]
})
export class FileCursosModule {}
