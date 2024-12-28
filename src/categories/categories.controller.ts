import { Body,Headers, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { CreateCategoryDto } from './dto/create-categoryDto';
import { get } from 'http';
import { updatecategoryDto } from './dto/update-categoryDto';
import { JwtService } from '@nestjs/jwt';

@Controller('categories')
export class CategoriesController {

    constructor(private CategoryServices: CategoriesService,private jwtservice: JwtService){

    }

 @HasRoles(JwtRole.CLIENT,JwtRole.ADMIN,JwtRole.PROF )
 @UseGuards(JwtAuthGuard ,JwtRolesGuard)
 @Get()
 findall(@Headers() headers){
  var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
  
    return this.CategoryServices.findall(idclient['id']);

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
 @Body() category:CreateCategoryDto) {
 
  return this.CategoryServices.create(file,category);
}


@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Put('upload/:id')
@UseInterceptors(FileInterceptor('file'))
updateWithImage(@UploadedFile( 
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024*1024*10 }),
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    ],
  }),
) file: Express.Multer.File,
@Param('id',ParseIntPipe) id:number,
 @Body() category:updatecategoryDto) {
 
  return this.CategoryServices.updateWithImage(file,id,category);
}


@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Put(':id')
update(@Param('id',ParseIntPipe) id:number,
@Body() category:updatecategoryDto){

return this.CategoryServices.update(id,category);
}


@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Delete(':id')
delete(@Param('id',ParseIntPipe) id:number){

return this.CategoryServices.delete(id);
}
}
