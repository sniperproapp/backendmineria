import { Body,Headers, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CategoriesCursosService    } from './categories_cursos.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
 
import { JwtService } from '@nestjs/jwt';
 
import { updatecategoryCursosDto } from './dto/update-categoryCursosDto';
import { CreateCategoryCursosDto } from './dto/create-categoryCursosDto copy';

@Controller('categoriescursos')
export class CategoriesCursosController {

    constructor(private CategoryServices: CategoriesCursosService,private jwtservice: JwtService){

    }

 @HasRoles(JwtRole.CLIENT,JwtRole.ADMIN,JwtRole.PROF )
 @UseGuards(JwtAuthGuard ,JwtRolesGuard)
 @Get(':busqueda')
 findall(@Param('busqueda') busqueda: string){
  return this.CategoryServices.findall(busqueda);
 }



  
 @Get('findtienda/:busqueda')
 findalltienda(@Param('busqueda') busqueda: string){
    return this.CategoryServices.findalltienda(busqueda);
 }

   
 @Get('findtiendacategoriacurso/:busqueda')
 findalltiendacategoriacurso(@Param('busqueda') busqueda: string){
    return this.CategoryServices.findalltiendacategoriacursos( );
 }


@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post()
@UseInterceptors(FileInterceptor('file'))
createWithImage(@UploadedFile( 
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024*1024*10 }),
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    ],
  }),
) file: Express.Multer.File,
 @Body() category:CreateCategoryCursosDto) {
 
  return this.CategoryServices.create(file,category);
}













@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('updateimagen')
@UseInterceptors(FileInterceptor('file'))
updateWithImage(@UploadedFile( 
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024*1024*10 }),
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    ],
  }),
) file: Express.Multer.File,
 
 @Body() category:updatecategoryCursosDto) {
 
  return this.CategoryServices.updateWithImage(file,category.id,category);
}



 


@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('update')
update( 
@Body() category:updatecategoryCursosDto){

return this.CategoryServices.update(category.id,category);
}


@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Delete(':id')
delete(@Param('id',ParseIntPipe) id:number){

return this.CategoryServices.delete(id);
}
}
