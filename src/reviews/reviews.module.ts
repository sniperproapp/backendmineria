import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { User } from 'src/users/user.entity';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { JwtModule } from '@nestjs/jwt';
 
 
 
import { CuponCursos } from 'src/cupones/cuponCursos.entity';
import { ReviewsController } from './reviews.controller';
import { Reviews } from './reviews.entity';
import { ReviewsService } from './reviews.service';

@Module({
  imports:[TypeOrmModule.forFeature([Reviews,User,CuponCursos ]),JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10000h' },
  })],
  controllers: [ReviewsController],
  providers: [ReviewsService,JwtStrategy]
})
export class ReviewsModule {}
