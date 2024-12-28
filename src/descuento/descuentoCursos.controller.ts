import { Body,   Controller, Delete,  FileTypeValidator,  Get,    MaxFileSizeValidator,    Param,    ParseFilePipe,    ParseIntPipe, Post,   UploadedFile,   UseGuards, UseInterceptors  } from '@nestjs/common';
 
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
 
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
 
import { CreatedescuentoCursosDto } from './dto/create-descuentoCursosDto';
import { updatedescuentoCursosDto } from './dto/update-descuentoCursosDto';
import { descuentoCursosService } from './descuento_cursos.service';
 

@Controller('discount')
export class descuentoCursosController {

    constructor(private descuentoServices: descuentoCursosService ){

    }

    @HasRoles(JwtRole.ADMIN,JwtRole.PROF)
    @UseGuards(JwtAuthGuard,JwtRolesGuard)
    @Get(':code')
    findall(@Param('code') code: string){
      return this.descuentoServices.findAll(code);
    }



        
@Get('findtiendabaner/:busqueda')
finAlltiendabaner(@Param('busqueda') busqueda: string ) {
 return this.descuentoServices.findAlltiendabaner( );
}



   
@Get('findtiendaflash/:busqueda')
findAlltiendaflash(@Param('busqueda') busqueda: string ) {
 return this.descuentoServices.findAlltiendaflash( );
}




    @HasRoles(JwtRole.ADMIN,JwtRole.PROF)
    @UseGuards(JwtAuthGuard,JwtRolesGuard)
    @Get('show/:id')
    findone(@Param('id') id: number){
      return this.descuentoServices.findone(id);
    }
    

@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post() 
createWithImage(   
 @Body()  descuento :CreatedescuentoCursosDto) {
 
   return this.descuentoServices.create( descuento);
}


  

@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('update')
update( 
@Body() descuento:updatedescuentoCursosDto){

return this.descuentoServices.update(descuento.id,descuento);
}


@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Delete('remove/:id')
delete(@Param('id',ParseIntPipe) id:number){

return this.descuentoServices.delete(id);
}


 
}
