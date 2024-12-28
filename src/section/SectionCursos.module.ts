import { Module } from '@nestjs/common';
 
 
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { User } from 'src/users/user.entity';
import { SectionCursosService } from './section_cursos.service';
import { SectionCursosController } from './SectionCursos.controller';
import { SectionCursos } from './SectionCursos.entity';
 
 

@Module({
  imports:[TypeOrmModule.forFeature([SectionCursos,User]),JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  providers: [SectionCursosService,JwtStrategy],
  controllers: [SectionCursosController]
})
export class SectionCursosModule {}
