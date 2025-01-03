import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
 
 
import BigNumber from 'bignumber.js';
import { IBscScanTransaction } from 'src/interfaces/bscscan-transaction.interface';
import { BscscanService } from 'src/bscscan/bscscan.service';
import { ReceivingWalletService } from 'src/ReceivingWallet/ReceivingWallet.service';
import { TransactionService } from 'src/transaccion/transaction.service';
import { ReceivingWallet } from 'src/ReceivingWallet/ReceivingWallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';



@Injectable()
export class PaymentsService {
    constructor(
       @InjectRepository(ReceivingWallet) private ReceivingWalletRepository: Repository<ReceivingWallet>,
        private bscsanApi:BscscanService,
        private transactionsService:TransactionService,
        private receivingWallets:ReceivingWalletService,
    ){}

    async listTransactions() {
      const transactions = await this.bscsanApi.listTransactions();
      return transactions;
    }
  
    async processTransactions(address: string) {
      const mainWallet = await this.getMainWallet(address);
  
      const previousBlock = new BigNumber(mainWallet.lastBlock).minus(1);
  
      const transactions = await this.bscsanApi.listTransactions(previousBlock.toString());
  
      if (transactions.length > 0) {
        this.transactionsService.processTransactions(transactions);
  
        const maxBlock = this.getMaxBlock(transactions).toString();
  
        if(mainWallet.lastBlock !== maxBlock) {
          mainWallet.lastBlock = maxBlock;
          await this.ReceivingWalletRepository.save(mainWallet);
  
          console.log('New \'Last Block\'', mainWallet.lastBlock);
        }
      }
  
      return transactions;
    }
  
    private getMaxBlock(transactions: IBscScanTransaction[]) {
      let maxBlock = new BigNumber(transactions[0].blockNumber);
  
      for (let i = 1; i < transactions.length; i++) {
        const block = new BigNumber(transactions[i].blockNumber);
        if (block.gt(maxBlock)) {
          maxBlock = block;
        }
      }
  
      return maxBlock;
    }
  
    private async getMainWallet(address: string) {
      const mainWallet = await this.receivingWallets.getOrCreateWallet(address);
  
      if (mainWallet.lastBlock === '0') {
        mainWallet.lastBlock = await this.bscsanApi.getFirstBlock();
        await this.ReceivingWalletRepository.save(mainWallet);
        console.log('New \'Last Block\'', mainWallet.lastBlock);
      }
  
      return mainWallet;
    }
}
