import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
 
 
 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
 
 
import { Wallet } from './wallet.entity';



@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet) private WalletRepository: Repository<Wallet> 
    ){}

    async findWallet(address: string) {
      const wallet = await this.WalletRepository.findOne({where:{id:address.toLowerCase()}})
      if (wallet) { 
        return wallet  
      }else{
        return   null;

      }
      
    }
  
    async getOrCreateWallet(id: string) {
      let wallet = await this.findWallet(id);
  
      if (!wallet) {
        wallet = this.WalletRepository.create({ id, balance: 0 } );
        await this.WalletRepository.save(wallet);
      }
  
      return wallet;
    }


 
    async sumarprocentajewallet()
    {

      const wallet = await this.WalletRepository.find()
      let ganancia:number
      let balance:number
      for(let i=0;i<wallet.length;i++)
      {
         ganancia= wallet[i].balance_ganancia;
         balance=wallet[i].balance;
         ganancia= (balance*0.005) + wallet[i].balance_ganancia*1
        console.log(  (ganancia) +'\n')
        
        wallet[i].balance_ganancia=ganancia;

      }
      await this.WalletRepository.save(wallet);

    }


}
