import { Body,Headers, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
 
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-Rol';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
 
 
 
import { JwtService } from '@nestjs/jwt';
import { BscscanService } from './bscscan.service';
 

@Controller('Bscscan')
export class BscscanController {

    constructor(private BscscanServices:BscscanService,private jwtservice: JwtService){

    }

 
}
