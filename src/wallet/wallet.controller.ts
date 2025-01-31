import { Body,Headers, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
 
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
 
 
 
import { JwtService } from '@nestjs/jwt';
import { WalletService } from './wallet.service';
import { editwallet } from './dto/editwallet.dto';

@Controller('wallet')
export class WalletController {

    constructor(private WalletServices:WalletService,private jwtservice: JwtService){

    }


     @Post('cambiar')
        finAllCategory(@Body() editwallet:editwallet,@Headers() headers) {
        
           
          var idclient = this.jwtservice.decode(headers['authorization'].split(' ')[1]);
          
         console.log(editwallet)
        
          return this.WalletServices.cambiarwallet(editwallet.walletnew ,editwallet.walletold);
        }
 
}
