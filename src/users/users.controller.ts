import { Body, Controller,Headers, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors, Search } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { UpdateTimeLimitUserDto } from './dto/update_time_limit-user';

@Controller('users')
export class UsersController {
constructor(private UsersService:UsersService){}


@Get('instructor/all')
findallinstructor( ){
  return this.UsersService.findAllinstructor( );
}

@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard,JwtRolesGuard)
@Get(':busqueda')
findall(@Param('busqueda') busqueda: string){
  return this.UsersService.findAll(busqueda);
}


 





@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard,JwtRolesGuard)
@Get('list/admin/:search')
findalladmin(@Param('search') busqueda: string){
  console.log(busqueda)
  return this.UsersService.findAlladmin(busqueda);
}



@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard,JwtRolesGuard)
@Get('list/admin/prof/:search')
findalladminpro(@Param('search') busqueda: string){
  console.log(busqueda)
  return this.UsersService.findAlladminpro( );
}

@Post()
create(@Body() user:CreateUserDto){
    return this.UsersService.create(user);
}

@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard,JwtRolesGuard)
@Put('desactivate/all')
updatedesactivate( ){
    return this.UsersService.desactivateall();
}


@HasRoles(JwtRole.CLIENT,JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard,JwtRolesGuard)
@Put(':id')
update(@Param('id',ParseIntPipe) id: number,   @Body() user:UpdateUserDto){
    return this.UsersService.update(id, user);
}


@HasRoles( JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard,JwtRolesGuard)
@Put('delete/:id')
updatedelete(@Param('id',ParseIntPipe) id: number,   @Body() user:UpdateUserDto){
    return this.UsersService.inactivate(id);
}






@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard,JwtRolesGuard)
@Put('activate/:id')
updateactivate(@Param('id',ParseIntPipe) id: number,@Body() timelimit:UpdateTimeLimitUserDto   ){
    return this.UsersService.activate(id,timelimit);
}





@HasRoles(JwtRole.ADMIN,JwtRole.CLIENT,JwtRole.PROF)
@UseGuards(JwtAuthGuard,JwtRolesGuard)
@Put('descargo/:id')
updatedescargo(@Param('id',ParseIntPipe) id: number   ){
    return this.UsersService.descargo(id);
}

@HasRoles(JwtRole.ADMIN,JwtRole.PROF)
@UseGuards(JwtAuthGuard,JwtRolesGuard)
@Put('inactivate/:id')
updateinactivate(@Param('id',ParseIntPipe) id: number ){
    return this.UsersService.inactivate(id );
}


@HasRoles(JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Put('update/:id')
@UseInterceptors(FileInterceptor('file'))
updateWithImage(@UploadedFile( 
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024*1024*10 }),
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    ],
  }),
) file: Express.Multer.File,
@Param('id',ParseIntPipe) id: number,  
 @Body() user:UpdateUserDto) {
 
  return this.UsersService.updateWithImage(file,id,user);
}

}
 