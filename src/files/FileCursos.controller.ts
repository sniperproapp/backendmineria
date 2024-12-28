import { Body,   Controller, Delete,  FileTypeValidator,  Get,    MaxFileSizeValidator,    Param,    ParseFilePipe,    ParseIntPipe, Post,   UploadedFile,   UseGuards, UseInterceptors  } from '@nestjs/common';
 
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
 
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
 
 
 
import { updateclaseCursosDto } from './dto/update-claseCursosDto';
 
import { CreateClaseCursosDto    } from './dto/create-ClaseCursosDto';
 
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreatecursovideoDto } from 'src/cursos/dto/Create-Curso-video.dto';
import { renameimage } from 'src/cursos/helpers/imagen.helpers';
import { FileCursosService } from './File_cursos.service';
import { CreatefilevideoDto } from './dto/Create-file-video.dto';

@Controller('course_File')
export class FileCursosController {

    constructor(private FileServices: FileCursosService ){

    }

    @HasRoles(JwtRole.ADMIN,JwtRole.PROF)
    @UseGuards(JwtAuthGuard,JwtRolesGuard)
    @Get(':id')
    findall(@Param('id') id: number){
      return this.FileServices.findAll(id);
    }
    

 

  

@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('update')
update( 
@Body() clase:updateclaseCursosDto){

return this.FileServices.update(clase.id,clase);
}


@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Delete('remove/:id')
delete(@Param('id',ParseIntPipe) id:number){

return this.FileServices.delete(id);
}




@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('upload_file')
@UseInterceptors(FileInterceptor('file' ))
upload(@UploadedFile( 
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024*1024*10 }),
      
    ],
  }),
) file: Express.Multer.File,
 @Body() info:CreatefilevideoDto)  {
  console.log(file)
 
  return this.FileServices.createuploadfile(file,info);
}
}
