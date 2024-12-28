import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
 
import  storage = require( '../utils/cloud_storage');
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
 
import { User } from 'src/users/user.entity';
 
 
import { updatesectionCursosDto } from './dto/update-sectionCursosDto';
import {    CreateSectionCursosDto } from './dto/create-sectionCursosDto';
import { SectionCursos } from './SectionCursos.entity';



@Injectable()
export class SectionCursosService {
    constructor(
        @InjectRepository(SectionCursos) private SectionRepository: Repository<SectionCursos>,@InjectRepository(User) private usersRepository: Repository<User>
    ){}

    async findAll(id:number){
      
        return this.SectionRepository.find({where:{id_curso:id} });
    }
    
      
       
     
       
    

   

    async create(  section:CreateSectionCursosDto){

      const categorifound= await this.SectionRepository.findOneBy({title:section.title})
      // if(categorifound){
      //  throw new HttpException('la seccion ya se encuentra registrada ',HttpStatus.OK);

      // }
       let newsection = this.SectionRepository.create( section);
 
     
      
       
      return this.SectionRepository.save(newsection);
    }


     




     async update( id: number,section:updatesectionCursosDto){
        
      
     

        const categorifound= await this.SectionRepository.findOneBy({id: id})
        if(!categorifound){
         throw new HttpException('la categoria no se encuentra ',HttpStatus.OK);
 
        }
         console.log(section);
         console.log(categorifound
          
         );

         categorifound.title=section.title;
         categorifound.estado=section.estado;
        return this.SectionRepository.save(categorifound);
      }

      async delete(id: number){

        const categorifound = await this.SectionRepository.findOneBy({id: id})
        if(!categorifound){
            throw new HttpException('la categoria no se encuentra ',HttpStatus.NOT_FOUND);
    
           }
       
        return this.SectionRepository.delete(id);

    }


    

}
