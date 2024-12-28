import { Module } from '@nestjs/common';
 
 
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { User } from 'src/users/user.entity';
import { saleService } from './sale.service';
import { Sale } from './sale.entity';
import { saleController } from './sale.controller';
import { Carrito } from 'src/carrito_de_compras/Carrito.entity';
import { Saledetail } from 'src/saledetail/saledetail.entity';
import { Cursostudent } from 'src/studentcurso/Cursostudent.entity';
import { MailsService } from 'src/mails/mails.service';
 
 
 

@Module({
  imports:[TypeOrmModule.forFeature([Sale,Cursostudent,Carrito,Saledetail,User]),JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  providers: [saleService,JwtStrategy,MailsService],
  controllers: [saleController]
})
export class saleModule {}
