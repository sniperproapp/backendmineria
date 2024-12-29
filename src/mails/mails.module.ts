import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailerModule } from '@nestjs-modules/mailer';
import {   ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
 
import { Saledetail } from 'src/saledetail/saledetail.entity';
import { Sale } from 'src/sale/sale.entity';
 
 
const configService = new ConfigService();

@Module({
  exports:[MailsService],
  imports:[
    MailerModule.forRootAsync({
     useFactory: async (config:ConfigService)=>({ 
      transport:{
        host:'email-smtp.us-east-1.amazonaws.com',
        secure: true,
        port:465,
        auth:{user:'AKIA3FLDZQGMBJCV4AGD',pass:'BAE/5LFZN20uEbInchPr9SnFQJz+aTurc6g39XERoErU',}
      },
      defaults:{from: `"NO REPLY"<info@blockzonx.com>`,},
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
