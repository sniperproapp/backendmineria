import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saledetail } from 'src/saledetail/saledetail.entity';
import { Sale } from 'src/sale/sale.entity';
 

 
 

@Module({
  exports:[MailsService],
  imports:[
    MailerModule.forRootAsync({
     useFactory: async (config:ConfigService)=>({
      transport:{
        host:'tusoporteweb.cl',
        secure: true,
        port:465,
        auth:{user:'sniperproapp@tusoporteweb.cl',pass:'gllv1992..',}
      },
      defaults:{from: `"NO REPLY" <sniperproapp@tusoporteweb.cl>`,},
      template:{dir: join(__dirname,'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
            },
      },
     }),
     inject:[ConfigService]

    })
    
  ],
  providers: [MailsService,Saledetail,Sale],
})
export class MailsModule {}
