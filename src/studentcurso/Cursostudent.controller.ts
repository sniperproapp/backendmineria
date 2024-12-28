import { Body, Controller, Post, UseGuards } from '@nestjs/common';
 
import { CreateRolDto } from './dto/create-rol.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { CursostudentService } from './Cursostudent.service';

@Controller('curso_studen')
export class CursostudentController {
constructor( private RolesService: CursostudentService){}


@HasRoles(JwtRole.ADMIN)
@UseGuards(JwtAuthGuard,JwtRolesGuard)
@Post()
create(@Body() rol:CreateRolDto){
  return this.RolesService.create(rol);
}


}
