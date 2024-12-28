import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import  PUSH = require('../utils/firebase_message') ;
 
import  storage = require( '../utils/cloud_storage');
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/user.entity';
import { CreateMensajeDto } from './dto/create.dto';



@Injectable()
export class MensajeService {
    constructor(
      @InjectRepository(User) private usersRepository: Repository<User>
    ){}

  

   

    async create(data: CreateMensajeDto){
     
       


        
        let listastrintoken: Array<string> =[]   
        let listuser= await this.usersRepository.find({relations:['roles']});
         
        let data1={};
        let i =0;
        

        listuser.forEach(async (element) => {
          
       i++;
      
           if(  element.notification_token!== null  ){
               if(element.notification_token.length>30 ){
                  // if(element.estado==1){
                   listastrintoken.push(element.notification_token);
                 // }
                    
                      
                }
           }
      
           if(i==499)
           {
              
                data1 ={
                   tokens: listastrintoken ,
                    title:  data.titulo,
                   body:data.description  }
                listastrintoken =[] ;
                i=0;
                  this.enviarpush(data1);
              
           }

        })
        data1 ={
           tokens:listastrintoken,
           title:data.titulo,
           body:data.description
        }
        this.enviarpush(data1);
       

      
       
      
      
     
      return true  ;
    }


   



 
   

    enviarpush(data1){  PUSH(data1); }


    

}
