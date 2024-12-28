import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';

@Controller('roles')
export class RolesController {
constructor( private RolesService: RolesService){}


@HasRoles(JwtRole.ADMIN)
@UseGuards(JwtAuthGuard,JwtRolesGuard)
@Post()
create(@Body() rol:CreateRolDto){
  return this.RolesService.create(rol);
}


}
