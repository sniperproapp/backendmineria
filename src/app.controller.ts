import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { createConnection } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ReceivingWalletService } from './ReceivingWallet/ReceivingWallet.service';
import { PaymentsService } from './payments/payments.service';
 

@Controller()
export class AppController {

  

  
}
