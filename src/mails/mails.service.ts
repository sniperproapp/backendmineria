import { Injectable } from '@nestjs/common';
 
import { MailerService } from '@nestjs-modules/mailer';
 
 

@Injectable()
export class MailsService {
   
  constructor( 
   
private mailerservices: MailerService

  ){}

  async senUserConfirmation( email:string,token:string){
    await this.mailerservices.sendMail({
      to:email,
      subject:"Recuperar Password",
      template:'./recueperarpass',
      context:{id:token}
      
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
     
      await this.mailerservices.sendMail({
        to:email,
        subject:"LINK DE PAGO SNIPER PRO ",
        template:'./html',
        context:{Orden:Orden,Orden_detail:OrdenDetail,}
        
      })
      
    

  } catch (error) {
      console.log(error);
  }
 
  
}



async sendmaillinkdepago(Orden:any,email:any){

    
  try {
   
    await this.mailerservices.sendMail({
      to:email,
      subject:"FACTURA SNIPER PRO ",
      template:'./htmllink',
      context:{Orden:Orden}
      
    })
    
  

} catch (error) {
    console.log(error);
}


}
}
