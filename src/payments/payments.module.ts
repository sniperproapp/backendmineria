import { Module } from '@nestjs/common';
 
 
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
 
 
import { PaymentsService } from './payments.service';
import { ReceivingWallet } from 'src/ReceivingWallet/ReceivingWallet.entity';
import { PaymentsController } from './Payments.controller';
import { BscscanService } from 'src/bscscan/bscscan.service';
import { ReceivingWalletService } from 'src/ReceivingWallet/ReceivingWallet.service';
import { TransactionService } from 'src/transaccion/transaction.service';
import { Transaction } from 'src/transaccion/transaction.entity';
import { Wallet } from 'src/wallet/wallet.entity';
import { Currency } from 'src/currecy/currency.entity';
import { WalletService } from 'src/wallet/wallet.service';

@Module({exports:[PaymentsService],
  imports:[TypeOrmModule.forFeature([Transaction,Wallet,Currency,ReceivingWallet ]),JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  providers: [PaymentsService,BscscanService,TransactionService,ReceivingWalletService,WalletService,JwtStrategy],
  controllers: [PaymentsController]
})
export class PaymentsModule {}
