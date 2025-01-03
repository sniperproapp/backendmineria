import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { createConnection } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ReceivingWalletService } from './ReceivingWallet/ReceivingWallet.service';
import { PaymentsService } from './payments/payments.service';
 
const configService = new ConfigService();
@Controller()
export class AppController {

  
  constructor(
    private readonly appService: AppService,
    private readonly   processor: PaymentsService,
    private readonly  receivingWallets: ReceivingWalletService
 
 
   
  ) {}

 

  private isProcessing = false;

  async init() {
    //await createConnection();

    await this.ensureMainWallet();

    this.startPaymentsProcessor();
  }

  private get mainWalletAddress() {
    const receivingWalletAddress = configService.get('WALLET');
    if (!receivingWalletAddress) {
      throw new Error('Missing main wallet');
    }

    return receivingWalletAddress;
  }

  private startPaymentsProcessor() {
    const processInterval = +(configService.get('PROCESS_INTERVAL') as string);
    console.log(processInterval);
    setInterval(() => {
      if (!this.isProcessing) {
        console.log('Processing transactions...');

        this.processor.processTransactions(this.mainWalletAddress)
          .then(() => console.log('Transactions processed successfully'))
          .catch(err => console.log('Error processing transactions', err))
          .finally(() => this.isProcessing = false);

        this.isProcessing = true;
      }
    }, processInterval * 1000);
  }

  private async ensureMainWallet() {
    const mainWallet = await this.receivingWallets.getOrCreateWallet(this.mainWalletAddress);
    console.log('Main wallet', mainWallet.address.substr(0, 6) + '...');
    console.log('Last block', mainWallet.lastBlock);
  }
 

  @Get()
  getHello(): string {
    this.init()
    return this.appService.getHello();
  }
}
