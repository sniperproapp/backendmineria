import { Module } from '@nestjs/common';
 
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { User } from 'src/users/user.entity';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { Rol } from 'src/roles/rol.entity';
import { CursostudentController } from './Cursostudent.controller';
import { CursostudentService } from './Cursostudent.service';
import { Cursostudent } from './Cursostudent.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Rol,User,Cursostudent])],
  controllers: [CursostudentController],
  providers: [CursostudentService,JwtStrategy]
})
export class CursostudentModule {}
