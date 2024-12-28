import { Body,Headers, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
 
import { HasRoles } from 'src/auth/jwt/has-roles';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
 
 
import { JwtService } from '@nestjs/jwt';
import { CursosService } from './Cursos.service';
import { CreatecursoDto } from './dto/Create-Curso.dto';
import { UpdateCursoDto } from './dto/update-Curso.dto';
import { CreatecursovideoDto } from './dto/Create-Curso-video.dto';
import { diskStorage } from 'multer';
import { renameimage } from './helpers/imagen.helpers';
import { filtroDto } from './dto/filtro.dto';
import { Updatecheck } from './dto/updatecheck.dto';
@Controller('courses')
export class CursosController {

constructor(private cursoservices: CursosService,private jwtservice: JwtService){}
 TOKEN_VIMEO="889f192e0d994122eee55e2a43a334d1";




@HasRoles(JwtRole.ADMIN,JwtRole.PROF,JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Get()
finAll( ) {
  
  
  return this.cursoservices.findAll( );
}





@Get('config-all')
configall( ) {
 return this.cursoservices.config_filtro( );
}

 
@Get('findtienda')
finAlltienda( ) {
  
  
  return this.cursoservices.findAlltienda( );
}


 
@Get('findtiendacategory/:id_category')
finAlltiendacategory( @Param('id_category',ParseIntPipe) id_category:number ) {
  
  
  return this.cursoservices.findAlltiendacategory(id_category );
}


@Get('findtiendauser/:id_user')
finAlltiendauser( @Param('id_user',ParseIntPipe) id_user:number ) {
  
  
  return this.cursoservices.findAlltiendauser(id_user );
}


 
 



 


@HasRoles(JwtRole.ADMIN,JwtRole.PROF,JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Get('show/:id_curso')
finAllproduct( @Param('id_curso',ParseIntPipe) id_curso:number ) {
  
  return this.cursoservices.findAllcurso(id_curso );
}/////////////////////



 
@Get('landingcurso/:id_curso')
finAllproductlandingcurso(@Headers() headers,@Param('id_curso',ParseIntPipe) id_curso:number, ) {
  var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
  if(idclient){
    return this.cursoservices.findAllcursolanding(id_curso,idclient.id );
  }else{
    return this.cursoservices.findAllcursolanding(id_curso );
  }
  
}


@Get('vercurso/:id_curso')
finAllvercurso( @Headers() headers,@Param('id_curso',ParseIntPipe) id_curso:number, ) {
  var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
  return this.cursoservices.findAllvercursolanding(id_curso,idclient.id );
}




 

 


 

@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post()
@UseInterceptors(FileInterceptor('file'))
create(@UploadedFile( 
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024*1024*10 }),
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    ],
  }),
) file: Express.Multer.File,
 @Body() curso:CreatecursoDto) {
  
  return this.cursoservices.create(file,curso);
}








@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('upload_vimeo')
@UseInterceptors(FileInterceptor('file',{
  storage:diskStorage({
    destination:'./upload',
    filename:renameimage
  })
}))
upload(@UploadedFile( 
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024*1024*100 }),
      new FileTypeValidator({ fileType: '.(mpg|wmv|mp4)' }),
    ],
  }),
) file: Express.Multer.File,
 @Body() curso:CreatecursovideoDto)  {
  console.log(file)
 
  return this.cursoservices.uploadvideo(file,curso);
}

 

 

 
@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Put('updateimagen')
@UseInterceptors(FileInterceptor('file'))
updatewithimage(@UploadedFile( 
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024*1024*10 }),
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    ],
  }),
) file: Express.Multer.File,
 @Body() curso:UpdateCursoDto) {
 
  return this.cursoservices.updateWithImage(file,curso);
}


@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Put('update')
Update ( 
 
 @Body() curso:UpdateCursoDto) {
 
  return this.cursoservices.update(  curso);
}


@HasRoles(JwtRole.CLIENT )
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('updatecheck')
Updatecheck ( 
 
 @Body() updatecheck:Updatecheck) {
 
  return this.cursoservices.updatecheck(  updatecheck);
}


 
 
@Post('search-course')
filtro ( 
 
 @Body() filtro:filtroDto) {
 
  return this.cursoservices.search_curso(  filtro);
}




@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Delete('remove/:id')
 
delete ( 
@Param('id',ParseIntPipe) id:number)
  {
 
  return this.cursoservices.delete(id);
}


 
}
