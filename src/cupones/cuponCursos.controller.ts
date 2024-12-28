import { Body,   Controller, Delete,  FileTypeValidator,  Get,    MaxFileSizeValidator,    Param,    ParseFilePipe,    ParseIntPipe, Post,   UploadedFile,   UseGuards, UseInterceptors  } from '@nestjs/common';
 
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
 
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
 import { cuponCursosService } from './cupon_cursos.service';
 
import { updatecuponCursosDto } from './dto/update-cuponCursosDto';
import { CreatecuponCursosDto } from './dto/create-cuponCursosDto';

@Controller('cupone')
export class cuponCursosController {

    constructor(private cuponServices: cuponCursosService ){

    }

    @HasRoles(JwtRole.ADMIN,JwtRole.PROF)
    @UseGuards(JwtAuthGuard,JwtRolesGuard)
    @Get(':code')
    findall(@Param('code') code: string){
      return this.cuponServices.findAll(code);
    }


    @HasRoles(JwtRole.ADMIN,JwtRole.PROF)
    @UseGuards(JwtAuthGuard,JwtRolesGuard)
    @Get('show/:id')
    findone(@Param('id') id: number){
      return this.cuponServices.findone(id);
    }
    

@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post() 
createWithImage(   
 @Body()  cupon :CreatecuponCursosDto) {
 
   return this.cuponServices.create( cupon);
}


  

@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('update')
update( 
@Body() cupon:updatecuponCursosDto){

return this.cuponServices.update(cupon.id,cupon);
}


@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Delete('remove/:id')
delete(@Param('id',ParseIntPipe) id:number){

return this.cuponServices.delete(id);
}


 
}
