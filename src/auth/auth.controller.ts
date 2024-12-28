import { Body,Headers,Get, Controller, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterauthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { LoginidAuthDto } from './dto/loginid-auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    
    constructor( private authServices: AuthService,private jwtservice: JwtService){

    }



 
 
@Get('informacionuser')
finAll( @Headers() headers,  ) {
  
  var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
  return this.authServices.informacionuser(idclient.id );
}

@Post('register')
create(@Body() user: RegisterauthDto){
        return this.authServices.register(user);
}


    
 
@Post('register_admin')
@UseInterceptors(FileInterceptor('file'))
updateWithImage(@UploadedFile( 
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024*1024*10 }),
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    ],
  }),
) file: Express.Multer.File,
  
 @Body() user: RegisterauthDto) {
    return this.authServices.register_admin(file,user);
  
}



    
    @Post('login')
    login(@Body() Logindata: LoginAuthDto){
        return this.authServices.login(Logindata);

    }


    @Post('login_admin')
    loginadmin(@Body() Logindata: LoginAuthDto){
        return this.authServices.login_admin(Logindata);

    }

    
    @Post('loginid')
    loginid(@Body() Loginiddata: LoginidAuthDto){
        return this.authServices.loginid(Loginiddata);

    }

    @Post('recuperarpass/:email')
    recuperarpass(@Param('email') email:string,){
        return this.authServices.recuperarpass(email);

    }
    
    
    @Post('updatepass')
    updatepass(@Body() Logindata: LoginAuthDto){
        return this.authServices.updatepass(Logindata);

    }

    @Post('logout/:email')
    logout(@Param('email') email:string,){
        return this.authServices.logout(email);

    }
}
 

