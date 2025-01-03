import { Module } from '@nestjs/common';
 
 
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { User } from 'src/users/user.entity';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './Currency.controller';
 

@Module({exports:[CurrencyService],
  imports:[ JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  providers: [CurrencyService,JwtStrategy],
  controllers: [CurrencyController]
})
export class CurrencyModule {}
