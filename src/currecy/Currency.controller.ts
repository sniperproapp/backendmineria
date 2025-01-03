import { Body,Headers, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
 
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
 
 
 
import { JwtService } from '@nestjs/jwt';
import { CurrencyService } from './currency.service';
 

@Controller('Currency')
export class CurrencyController {

    constructor(private currencyServices:CurrencyService,private jwtservice: JwtService){

    }

 
}
