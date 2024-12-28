import { Body,   Controller, Delete,  FileTypeValidator,  Get,    MaxFileSizeValidator,    Param,    ParseFilePipe,    ParseIntPipe, Post,   UploadedFile,   UseGuards, UseInterceptors  } from '@nestjs/common';
 
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
 
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
 
 
 
import { updateclaseCursosDto } from './dto/update-claseCursosDto';
 
import { CreateClaseCursosDto    } from './dto/create-ClaseCursosDto';
import { ClaseCursosService } from './Clase_cursos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreatecursovideoDto } from 'src/cursos/dto/Create-Curso-video.dto';
import { renameimage } from 'src/cursos/helpers/imagen.helpers';

@Controller('course_clase')
export class ClaseCursosController {

    constructor(private SectionServices: ClaseCursosService ){

    }

    @HasRoles(JwtRole.ADMIN,JwtRole.PROF)
    @UseGuards(JwtAuthGuard,JwtRolesGuard)
    @Get(':id')
    findall(@Param('id') id: number){
      return this.SectionServices.findAll(id);
    }
    

@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post() 
createWithImage(   
 @Body()  section :CreateClaseCursosDto) {
 
   return this.SectionServices.create( section);
}


  

@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('update')
update( 
@Body() clase:updateclaseCursosDto){

return this.SectionServices.update(clase.id,clase);
}


@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Delete('remove/:id')
delete(@Param('id',ParseIntPipe) id:number){

return this.SectionServices.delete(id);
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
 
  return this.SectionServices.uploadvideo(file,curso);
}
}
