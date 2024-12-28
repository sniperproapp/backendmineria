import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { User } from 'src/users/user.entity';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { JwtModule } from '@nestjs/jwt';
 
import { CategoryCursos } from 'src/categoriesCursos/categoryCursos.entity';
import { SectionCursos } from 'src/section/SectionCursos.entity';
import { DescuentoCursos } from 'src/descuento/descuentoCursos.entity';
import { Carrito } from './Carrito.entity';
import { CarritoService } from './Carrito.service';
import { CarritoController } from './Carrito.controller';
import { CuponCursos } from 'src/cupones/cuponCursos.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Carrito,User,CategoryCursos,SectionCursos,DescuentoCursos,CuponCursos ]),JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  controllers: [CarritoController],
  providers: [CarritoService,JwtStrategy]
})
export class CarritoModule {}
