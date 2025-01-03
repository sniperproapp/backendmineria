import { Module } from '@nestjs/common';
 
import {    WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { User } from 'src/users/user.entity';
import { Wallet } from './wallet.entity';
import { WalletService } from './wallet.service';

@Module({exports:[WalletService],
  imports:[TypeOrmModule.forFeature([Wallet ]),JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  providers: [WalletService,JwtStrategy],
  controllers: [WalletController]
})
export class WalletModule {}
