import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
 
import { Repository } from 'typeorm';
import { CreateRolDto } from './dto/create-rol.dto';
import { Cursostudent } from './Cursostudent.entity';

@Injectable()
export class CursostudentService {
constructor(@InjectRepository(Cursostudent) private CursostudentRepository: Repository<Cursostudent>){}


create (rol: CreateRolDto){
    const newRol = this.CursostudentRepository.create( );
    return this.CursostudentRepository.save(newRol);
}



}
