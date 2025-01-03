import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
 
 
 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
 
import { User } from 'src/users/user.entity';
import { ReceivingWallet    } from './ReceivingWallet.entity';



@Injectable()
export class ReceivingWalletService {
    constructor(
        @InjectRepository(ReceivingWallet) private ReceivingWalletRepository: Repository<ReceivingWallet> 
    ){}

    async getOrCreateWallet(address: string) {
      let wallet = await this.ReceivingWalletRepository.findOne({where:{ address: address }});
  
      if (!wallet) {
        wallet = this.ReceivingWalletRepository.create({ address: address, lastBlock: '0' });
        await this.ReceivingWalletRepository.save(wallet);
        console.log('New ReceivingWallet created');
      }
  
      return wallet;
    }
}
