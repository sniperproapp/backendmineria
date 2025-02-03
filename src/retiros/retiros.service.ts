import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
 
 
 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
 
import { User } from 'src/users/user.entity';
import { Retiros } from './Retiros.entity';
import { Wallet } from 'src/wallet/wallet.entity';
import { createretiro } from './dto/createretiro.dto';
 



@Injectable()
export class RetirosService {
    constructor(
      @InjectRepository(Retiros) private RetirosRepository: Repository<Retiros> ,
      @InjectRepository(User) private userRepository: Repository<User> ,
      @InjectRepository(Wallet) private walletRepository: Repository<Wallet> 
    ){}

    async generarretiro(id,retiro:any) {
      let createretirouser:createretiro={balance_retiro:retiro.numero,id_user:id}
      const userfound= await this.userRepository.findOne({relations:['wallet'],where:{id:id}})
      console.log(userfound)

      const walletfound = await this.walletRepository.findOne({where:{id: userfound.wallet.id}})
      if (retiro.numero>walletfound.balance)
        {
            throw new HttpException('error',HttpStatus.OK);
        }
      console.log(walletfound)
      walletfound.balance=(walletfound.balance*1)-(retiro.numero*1)
        this.RetirosRepository.save(createretirouser);
        this.walletRepository.save(walletfound);
     

     throw new HttpException('retiro realizado ',HttpStatus.OK);
    }
  
    async cambiarstatus(id:any) {

      const retirofound= await this.RetirosRepository.findOne({where:{id_user:id}})
      
     if(!retirofound)
      {
          
             throw new HttpException('error',HttpStatus.OK);
          
      }
      retirofound.status=1;
      this.RetirosRepository.save(retirofound);
      throw new HttpException('retiro realizado ',HttpStatus.OK);
     
    }
 
    
      

}
