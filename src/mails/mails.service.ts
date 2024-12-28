import { Injectable } from '@nestjs/common';
 
import { MailerService } from '@nestjs-modules/mailer';
 
 

@Injectable()
export class MailsService {
   
  constructor( 
   
private mailerservices: MailerService

  ){}

  async senUserConfirmation( email:string){
    await this.mailerservices.sendMail({
      to:email,
      subject:"Recuperar Password",
      template:'./recueperarpass',
      context:{id:email}
      
    })
  }

  async welcome( email:string){
    await this.mailerservices.sendMail({
      to:email,
      subject:"Bienvenido a SNIPER PRO ",
      template:'./welcome',
      context:{id:email}
      
    })
  }



  async sendmail(Orden:any,OrdenDetail:any,email:any){

    
    try {
        
       

       
       
       

    console.log(Orden)
    console.log('Orden')


    console.log(OrdenDetail)

    
      await this.mailerservices.sendMail({
        to:email,
        subject:"FACTURA SNIPER PRO ",
        template:'./html',
        context:{Orden:Orden,Orden_detail:OrdenDetail,}
        
      })
      
    

  } catch (error) {
      console.log(error);
  }
 
  
}
}
