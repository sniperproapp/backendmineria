import { Body,Headers, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
 
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
 
 
 
import { JwtService } from '@nestjs/jwt';
import { RetirosService } from './retiros.service';
import { retirocreate } from './dto/retirocreate.dto';

@Controller('retiros')
export class RetirosController {

    constructor(private retirosServices:RetirosService,private jwtservice: JwtService){

    }

 
    @Post('generar')
    finAllCategory(@Body() retiro:retirocreate,@Headers() headers) {
    
       
      var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
      
     console.log(idclient)
     console.log(retiro)
      return this.retirosServices.generarretiro(idclient.id,retiro);
    }
    
}
