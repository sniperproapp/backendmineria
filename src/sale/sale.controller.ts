import { Body,Headers, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
 
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
 
import { JwtService } from '@nestjs/jwt';
 
import {  updatesectionCursosDto } from './dto/update-sectionCursosDto';
import { CreateSaleDto } from './dto/create-saleDto';
import { saleService } from './sale.service';

@Controller('sale')
export class saleController {

    constructor(private saleServices: saleService,private jwtservice: JwtService){

    }

    @HasRoles(JwtRole.ADMIN,JwtRole.PROF)
    @UseGuards(JwtAuthGuard,JwtRolesGuard)
    @Get(':id')
    findall(@Param('id') id: number,){
      
      return this.saleServices.findAll(id);
    }
    

@HasRoles(JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post() 
create(  @Headers() headers,  
 @Body()  sale :CreateSaleDto) {
  var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
   return this.saleServices.create(idclient.id, sale);
}


  

@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('update')
update( 
@Body() section:updatesectionCursosDto){

return this.saleServices.update(section.id,section);
}


@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Delete('remove/:id')
delete(@Param('id',ParseIntPipe) id:number){

return this.saleServices.delete(id);
}
}
