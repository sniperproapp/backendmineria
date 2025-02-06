import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
 
 
 
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, getConnection, QueryRunner, Repository } from 'typeorm';
 
 
 
import { Transaction } from './transaction.entity';
import { Currency } from 'src/currecy/currency.entity';
import { IBscScanTransaction } from 'src/interfaces/bscscan-transaction.interface';
import { WalletService } from 'src/wallet/wallet.service';
import { Wallet } from 'src/wallet/wallet.entity';
import BigNumber from 'bignumber.js';
 



@Injectable()
export class TransactionService {
    constructor(private dataSource: DataSource,
        @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
         @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
         @InjectRepository(Currency) private CurrencysRepository: Repository<Currency>
    ,private walletService:WalletService){}
    async processTransactions(apiTransactions: IBscScanTransaction[]
      
    ) {
      const currencies = await this.CurrencysRepository.find();
  
      for (const apiTransaction of apiTransactions) {
        const transactionId = `rv-${apiTransaction.hash}`;
        const exists = await this.transactionRepository.findOne({where:{ idhash: transactionId }});
  
        if (!exists) {
          const currency = currencies.find(m => m.contract.toLowerCase() == apiTransaction.contractAddress.toLowerCase());
  
          if (currency) {
            await this.saveTransactionAndUpdateWalletBalance(transactionId, apiTransaction, currency);
          }
        }
        else {
          console.log('Transaction already exists', { transactionId });
        }
      }
    }
    private async saveTransactionAndUpdateWalletBalance(transactionId: string, apiTransaction: IBscScanTransaction, currency: Currency) {
      
      
      
      const wallet = await this.walletService.getOrCreateWallet(apiTransaction.from);
  
      const queryRunner = this.dataSource.createQueryRunner();

     await queryRunner.connect();
     await queryRunner.startTransaction();
  try {
    const transaction = this.createTransactionEntity(queryRunner, transactionId, apiTransaction, currency, wallet);

   let data= await this.walletRepository.findOne({where:{id: wallet.id }})
   console.log('data.balance',data.balance);
   console.log('transaction.amount',transaction.amount);

   data.balance=data.balance*1+transaction.amount*1
   console.log('data.balance',data.balance);
   this.walletRepository.save(data); 
   console.log('Wallet saved', wallet.id);
   this.transactionRepository.save(transaction)
    await queryRunner.commitTransaction();
  } catch (err) {
    // since we have errors lets rollback the changes we made
    await queryRunner.rollbackTransaction();
  } finally {
    // you need to release a queryRunner which was manually instantiated
    await queryRunner.release();
  } 
        
     
    }
  
    private createTransactionEntity(queryRunner: QueryRunner, id: string, apiTransaction: IBscScanTransaction, currency: Currency, wallet: Wallet) {
      const transaction = queryRunner.manager.create(Transaction);
      transaction.idhash = id;
      transaction.date = new Date(apiTransaction.timeStamp * 1000);
      transaction.description = '';
      transaction.from = apiTransaction.from;
      transaction.to = apiTransaction.to;
      transaction.currency = currency;
      transaction.wallet = wallet;
  
      const amount = new BigNumber(apiTransaction.value).div(new BigNumber(10).pow(currency.decimals));
      transaction.amount = amount.toNumber();
  
      return transaction;
    }
    
}
