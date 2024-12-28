import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { User } from 'src/users/user.entity';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { JwtModule } from '@nestjs/jwt';
 
 
import { Saledetail } from './saledetail.entity';
 
 
import { SaledetailController } from './saledetail.controller';
import { SaledetailService } from './Saledetail.service';
import { CuponCursos } from 'src/cupones/cuponCursos.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Saledetail,User,CuponCursos ]),JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  controllers: [SaledetailController],
  providers: [SaledetailService,JwtStrategy]
})
export class SaledetailModule {}
