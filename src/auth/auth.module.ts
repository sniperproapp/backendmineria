
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt/jwt.constants';
import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt/jwt.strategy';
import { RolesService } from '../roles/roles.service';
import { Rol } from 'src/roles/rol.entity';
import { MailsService } from 'src/mails/mails.service';
import { Cursos } from 'src/cursos/Cursos.entity';
import { Sale } from 'src/sale/sale.entity';
import { Saledetail } from 'src/saledetail/saledetail.entity';
import { Cursostudent } from 'src/studentcurso/Cursostudent.entity';
import { ReviewsService } from 'src/reviews/reviews.service';
import { Reviews } from 'src/reviews/reviews.entity';
 

@Module({
  imports:[TypeOrmModule.forFeature([User, Rol,Cursos,Sale,Saledetail,Reviews,Cursostudent]),
  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })
],
 
  providers: [AuthService,RolesService,JwtStrategy,MailsService],
  controllers: [AuthController]
}) 
export class AuthModule {}
