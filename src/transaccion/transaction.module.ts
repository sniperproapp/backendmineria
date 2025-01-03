import { Module } from '@nestjs/common';
 
 
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { User } from 'src/users/user.entity';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { WalletService } from 'src/wallet/wallet.service';
import { Wallet } from 'src/wallet/wallet.entity';
import { Currency } from 'src/currecy/currency.entity';
  

@Module({exports:[TransactionService],
  imports:[TypeOrmModule.forFeature([Transaction,Wallet,Currency ]),JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  providers: [TransactionService,JwtStrategy,WalletService],
  controllers: [TransactionController]
})
export class TransactionModule {}
