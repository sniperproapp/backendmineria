import { Body,Headers, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
 
import { HasRoles } from 'src/auth/jwt/has-roles';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { JwtService } from '@nestjs/jwt';
import { SaledetailService } from './Saledetail.service';
import { CreateSaledetailDto } from './dto/Create-CreateSaledetailDto.dto';
 
 
 
@Controller('Saledetail')
export class SaledetailController {

constructor(private Saledetailervices: SaledetailService,private jwtservice: JwtService ){}
 




@HasRoles( JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Get()
finAll( @Headers() headers,  ) {
  
  var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
  return this.Saledetailervices.findAll(idclient.id );
}


 


@HasRoles(JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('register')
 create( @Headers() headers,  
 @Body() Saledetail:CreateSaledetailDto) {
  var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
  console.log(idclient.id) 
  console.log(Saledetail)
  return this.Saledetailervices.create(Saledetail,idclient.id );
}
// @HasRoles(JwtRole.ADMIN,JwtRole.PROF,JwtRole.CLIENT)
// @UseGuards(JwtAuthGuard ,JwtRolesGuard)
// @Get('show/:id_curso')
// finAllproduct(@Param('id_curso',ParseIntPipe) id_curso:number ) {
 
//   return this.Saledetailervices.findAllcurso(id_curso );
// }


 
  
 
@HasRoles(JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('update/:cupon')
Update ( @Headers() headers,@Param('cupon') cupon:string ) {
  var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
  return this.Saledetailervices.update( idclient.id,cupon );
}



 
@Delete('remove/:id')
 
delete ( 
@Param('id',ParseIntPipe) id:number)
  {
 
  return this.Saledetailervices.delete(id);
}


 
}
