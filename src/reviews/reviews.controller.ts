import { Body,Headers, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
 
import { HasRoles } from 'src/auth/jwt/has-roles';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { JwtService } from '@nestjs/jwt';
import { ReviewsService } from './reviews.service';
import { CreatereviewsRepository } from './dto/Create-CreatereviewsDto.dto';
import { UpdateReviewsDto } from './dto/update-Curso.dto';
 
 
 
 
@Controller('reviews')
export class ReviewsController {

constructor(private reviewservices: ReviewsService,private jwtservice: JwtService ){}
 




@HasRoles( JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Get()
finAll( @Headers() headers,  ) {
  
  var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
  return this.reviewservices.findAll(idclient.id );
}



 
 
@Get('getall/:id')
finreviewsAll( @Param('id',ParseIntPipe) id:number  ) {
  
   
  return this.reviewservices.findreviewsAll(id );
}


 
@Get('getallreviews')
finreviewsAllreviews(    ) {
  
   
  return this.reviewservices.findreviewsAllreviews(  );
}



 


@HasRoles(JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('review-register')
 create( 
 @Body() reviews:CreatereviewsRepository) {
   
 
  return this.reviewservices.create(reviews  );
}
// @HasRoles(JwtRole.ADMIN,JwtRole.PROF,JwtRole.CLIENT)
// @UseGuards(JwtAuthGuard ,JwtRolesGuard)
// @Get('show/:id_curso')
// finAllproduct(@Param('id_curso',ParseIntPipe) id_curso:number ) {
 
//   return this.reviewservices.findAllcurso(id_curso );
// }


 
  
 
@HasRoles(JwtRole.CLIENT)
@UseGuards(JwtAuthGuard ,JwtRolesGuard)
@Post('update')
Update ( @Body() reviews:UpdateReviewsDto) {
  
  return this.reviewservices.update( reviews );
}



 
@Delete('remove/:id')
 
delete ( 
@Param('id',ParseIntPipe) id:number)
  {
 
  return this.reviewservices.delete(id);
}


 
}
