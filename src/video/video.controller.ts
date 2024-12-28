import { Body, Controller, Get,   UseGuards } from '@nestjs/common';
 
 
 
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
 
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { VideoService } from './video.service';

@Controller('video')
export class VideoController {
constructor(private  videoservices:VideoService){}
 
@HasRoles(JwtRole.CLIENT,JwtRole.ADMIN,JwtRole.PROF
  )
  @UseGuards(JwtAuthGuard ,JwtRolesGuard)
  @Get()
  findall(){
     return this.videoservices.findAll();
 
  }
 

}
 