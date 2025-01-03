import { Controller } from '@nestjs/common';
 
 
 
 
import { JwtService } from '@nestjs/jwt';
import { TransactionService } from './transaction.service';
 

@Controller('Transaction')
export class TransactionController {

    constructor(private transactionServices:TransactionService,private jwtservice: JwtService){

    }

 
}
