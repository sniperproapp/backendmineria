import { Module } from '@nestjs/common';
 
 
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { User } from 'src/users/user.entity';
import { RetirosService } from './retiros.service';
import { Retiros } from './Retiros.entity';
import { RetirosController } from './retiros.controller';
import { Wallet } from 'src/wallet/wallet.entity';
import { MailsService } from 'src/mails/mails.service';
 

@Module({exports:[RetirosService],
  imports:[TypeOrmModule.forFeature([Retiros,Wallet,User ]),JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  providers: [RetirosService,JwtStrategy,MailsService],
  controllers: [RetirosController]
})
export class RetirosModule {}
