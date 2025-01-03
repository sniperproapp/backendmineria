import { Module } from '@nestjs/common';
 
 
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { User } from 'src/users/user.entity';
 
 
import { ReceivingWallet } from './ReceivingWallet.entity';
import { ReceivingWalletService } from './ReceivingWallet.service';
import { ReceivingWalletController } from './ReceivingWallet.controller';

@Module({exports:[ReceivingWalletService],
  imports:[TypeOrmModule.forFeature([ReceivingWallet  ]),JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  providers: [ReceivingWalletService,JwtStrategy],
  controllers: [ReceivingWalletController]
})
export class ReceivingWalletModule {}
