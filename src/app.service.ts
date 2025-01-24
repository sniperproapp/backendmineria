import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from './payments/payments.service';
import { ReceivingWalletService } from './ReceivingWallet/ReceivingWallet.service';
import { createConnection } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { WalletService } from './wallet/wallet.service';
const configService = new ConfigService();
@Injectable()
export class AppService {
  
  constructor(
    
    private readonly   processor: PaymentsService,
    private readonly  receivingWallets: ReceivingWalletService,
    private readonly   wallets: WalletService
 
 
   
  ) {}

 

  private isProcessing = false;
 

  @Cron('* * * * *')
  async init() {
    //await createConnection();

    await this.ensureMainWallet();

    this.startPaymentsProcessor();
  }

  @Cron('* * * * *')
  async validarporcentajes() {
   
console.log('procesando porcentajes')
   await this.wallets.sumarprocentajewallet();
    

    
  }

  private get mainWalletAddress() {
    const receivingWalletAddress = configService.get('WALLET');
    if (!receivingWalletAddress) {
      throw new Error('Missing main wallet');
    }

    return receivingWalletAddress;
  }

  private startPaymentsProcessor() {
     
     if (!this.isProcessing) {
        console.log('Processing transactions...');

        this.processor.processTransactions(this.mainWalletAddress)
          .then(() => console.log('Transactions processed successfully'))
          .catch(err => console.log('Error processing transactions', err))
          .finally(() => this.isProcessing = false);

        this.isProcessing = true;
      }
    
  }

  private async ensureMainWallet() {
    const mainWallet = await this.receivingWallets.getOrCreateWallet(this.mainWalletAddress);
    console.log('Main wallet', mainWallet.address.substr(0, 6) + '...');
    console.log('Last block', mainWallet.lastBlock);
  }
 
}
