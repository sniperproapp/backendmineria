import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/category.entity';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { User } from 'src/users/user.entity';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { JwtModule } from '@nestjs/jwt';
import { Cursos } from './Cursos.entity';
import { CursosController } from './Cursos.controller';
import { CursosService } from './Cursos.service';
import { CategoryCursos } from 'src/categoriesCursos/categoryCursos.entity';
import { SectionCursos } from 'src/section/SectionCursos.entity';
import { DescuentoCursos } from 'src/descuento/descuentoCursos.entity';
import { Cursostudent } from 'src/studentcurso/Cursostudent.entity';
import { Reviews } from 'src/reviews/reviews.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Cursos,User,CategoryCursos,SectionCursos,DescuentoCursos,Cursostudent,Reviews ]),JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  controllers: [CursosController],
  providers: [CursosService,JwtStrategy]
})
export class CursosModule {}
