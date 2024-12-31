import { Body,Headers, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
 
import { HasRoles } from 'src/auth/jwt/has-roles';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { JwtService } from '@nestjs/jwt';
import { UpdateCursoDto } from './dto/update-Curso.dto';
import { CarritoService } from './Carrito.service';
import { CreateCarritoDto } from './dto/Create-carrito.dto';
 
@Controller('carrito')
export class CarritoController {

constructor(private carritoervices: CarritoService,private jwtservice: JwtService ){}
 




@HasRoles( JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Get()
finAll( @Headers() headers,  ) {
  
  var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
  return this.carritoervices.findAll(idclient.id );
}


 


@HasRoles(JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('register')
 create( @Headers() headers,  
 @Body() carrito:CreateCarritoDto) {
  var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
  console.log(idclient.id) 
  console.log(carrito)
  return this.carritoervices.create(carrito,idclient.id );
}



 
@Post('registermensualidad') 
 createmensualidad( @Headers() headers,
 @Body() carrito:CreateCarritoDto) {
   
  var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
  console.log(carrito)
  return this.carritoervices.createmensualidad(carrito,idclient.id );
}





@Post('getstsuspay/:id') 
 getstatuspay( 
  @Param('id') id: string,) {
   
  
  
  return this.carritoervices.getstatuspay(  id );
}

// @HasRoles(JwtRole.ADMIN,JwtRole.PROF,JwtRole.CLIENT)
// @UseGuards(JwtAuthGuard ,JwtRolesGuard)
// @Get('show/:id_curso')
// finAllproduct(@Param('id_curso',ParseIntPipe) id_curso:number ) {
 
//   return this.carritoervices.findAllcurso(id_curso );
// }


 
  
 
 


 
@Delete('remove/:id')
 
delete ( 
@Param('id',ParseIntPipe) id:number)
  {
 
  return this.carritoervices.delete(id);
}


 
}
