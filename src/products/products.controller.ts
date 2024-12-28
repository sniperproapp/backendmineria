import { Body,Headers, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { CreateProductsDto } from './dto/Create-Products.dto';
import { UpdateProductsDto } from './dto/update-Products.dto copy';
import { dataidDto } from './dto/dataid.dto';
import { activatetpDto } from './dto/activatetp.dto';
import { datalikeDto } from './dto/datalike.dto';
import { dataestadoDto } from './dto/dataestado.dto';
import { dataestadolikeDto } from './dto/dataestadolike.dto';
import { JwtService } from '@nestjs/jwt';
@Controller('products')
export class ProductsController {

constructor(private producservices: ProductsService,private jwtservice: JwtService){}

@HasRoles(JwtRole.ADMIN,JwtRole.PROF,JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Get()
finAll(@Headers() headers) {
  
  var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
  return this.producservices.findAll(idclient['id']);
}



 @HasRoles(JwtRole.ADMIN,JwtRole.PROF,JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Get('cout')
finAllcount() {
 
  return this.producservices.finAllcount();
}
@HasRoles(JwtRole.ADMIN,JwtRole.PROF,JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Get('ranking')
finAllranking(@Headers() headers) {
  var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
  return this.producservices.finAllranking(idclient['id']);
}




@HasRoles(JwtRole.ADMIN,JwtRole.PROF,JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('category/:id_category')
finAllCategory(@Param('id_category',ParseIntPipe) id_category:number,@Body() estado:dataestadoDto,@Headers() headers) {

   
  var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
  
 
  return this.producservices.findAllCategory(id_category,estado,idclient['id']);
}


@HasRoles(JwtRole.ADMIN,JwtRole.PROF,JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Get(':id_product')
finAllproduct(@Param('id_product',ParseIntPipe) id_product:number,@Headers() headers ) {
  var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
  return this.producservices.findAllproduct(id_product ,idclient['id']);
}



@HasRoles(JwtRole.ADMIN,JwtRole.PROF,JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('category/like/:id_category')
finAllCategorylike(@Param('id_category',ParseIntPipe) id_category:number,@Body() estado:dataestadolikeDto,@Headers() headers) {
  var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
  return this.producservices.findAllCategorylike(id_category,estado,idclient['id']);
}


@HasRoles(JwtRole.ADMIN,JwtRole.PROF,JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('categorycount/:id_category')
finAllCategorycoun(@Param('id_category',ParseIntPipe) id_category:number) {
 
  return this.producservices.findAllCategorycoun(id_category );
}



@HasRoles(JwtRole.ADMIN,JwtRole.PROF,JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Get('id/:id')
findid(@Param('id',ParseIntPipe) id :number,) {
 
  return this.producservices.findid(id );
}
 
 

@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post()
@UseInterceptors(FilesInterceptor('files[]',2))
create(@UploadedFiles( 
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024*1024*10 }),
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    ],
  }),
) files: Array<Express.Multer.File>,
 @Body() product:CreateProductsDto) {
 
  return this.producservices.create(files,product);
}


@Post('usercategory')
usercategory(@Body() dataidDto: dataidDto){
    return this.producservices.getproductiduseridcategory(dataidDto);

}

@Post('activatetp')
activatetp(@Body() dataidDto: activatetpDto){
    return this.producservices.activatetp(dataidDto);

}

@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Put('upload/:id')
@UseInterceptors(FilesInterceptor('files[]',2))
Updatewithimage(@UploadedFiles( 
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024*1024*10 }),
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    ],
  }),
) files: Array<Express.Multer.File>,
@Param('id',ParseIntPipe) id:number,
 @Body() product:UpdateProductsDto) {
 
  return this.producservices.updateWithImage(id,files,product);
}



@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Put(':id')
 
Update ( 
@Param('id',ParseIntPipe) id:number,
 @Body() product:UpdateProductsDto) {
 
  return this.producservices.update(id,  product);
}



@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Delete(':id')
 
delete ( 
@Param('id',ParseIntPipe) id:number)
  {
 
  return this.producservices.delete(id);
}



@HasRoles(JwtRole.ADMIN,JwtRole.PROF,JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Put('like/:id')
 
like ( 
@Param('id',ParseIntPipe) id:number, @Body() datalike:datalikeDto)
  {
 
  return this.producservices.like(id,datalike);
}
}
