import { Body,Headers, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
 
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
 
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
 
 
import { JwtService } from '@nestjs/jwt';
import { MensajeService } from './mensaje.service';
import { CreateMensajeDto } from './dto/create.dto';

@Controller('mensaje')
export class MensajeController {

    constructor(private mensajeServices: MensajeService,private jwtservice: JwtService){

    }

   
@Post()
create( @Body() data: CreateMensajeDto){
 
  
    return this.mensajeServices.create( data);

 }

 


 

 


 
}
