import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
 
import { InjectRepository } from '@nestjs/typeorm';
import {   Repository } from 'typeorm';
 
import { User } from 'src/users/user.entity';
 
import { CuponCursos } from './cuponCursos.entity';
 
import { updatecuponCursosDto } from './dto/update-cuponCursosDto';
import { CreatecuponCursosDto } from './dto/create-cuponCursosDto';
 


 
@Injectable()
export class cuponCursosService {
    constructor(
        @InjectRepository(CuponCursos) private cuponRepository: Repository<CuponCursos>,@InjectRepository(User) private usersRepository: Repository<User>
    ){}

    async findAll(code:string){
      if(code=="allcupones"){
        return  this.cuponRepository.find(  );
      }else{

      }
        return  this.cuponRepository.find( {  where:{code:code}} );
    }
    
      
    async findone(id:number){

      const categorifound= await this.cuponRepository.findOneBy({id:id})
      if(!categorifound){
       throw new HttpException('el cupon no se encuentra registrado ',HttpStatus.OK);

      }
      
   
        return  this.cuponRepository.findOneBy( {  id:id} );
    } 
     
       
    

   

    async create(  cupon: CreatecuponCursosDto){
      console.log(cupon)
      const categorifound= await this.cuponRepository.findOneBy({code:cupon.code})
      if(categorifound){
       throw new HttpException('la seccion ya se encuentra registrada ',HttpStatus.OK);

      }
       let newcupon = this.cuponRepository.create( cupon);
 
     
      
       
      return this.cuponRepository.save(newcupon);
    }


     




     async update( id: number,cupon:updatecuponCursosDto){
        
      
     

        const categorifound= await this.cuponRepository.findOneBy({id: id})
        if(!categorifound){
         throw new HttpException('la categoria no se encuentra ',HttpStatus.OK);
 
        }
         console.log(cupon);
         console.log(categorifound
          
         );

         delete cupon.id;
         const updatedCupon = Object.assign(categorifound,cupon);
        return this.cuponRepository.save(updatedCupon);
      }

      async delete(id: number){

        const categorifound = await this.cuponRepository.findOneBy({id: id})
        if(!categorifound){
            throw new HttpException('la categoria no se encuentra ',HttpStatus.NOT_FOUND);
    
           }
       
        return this.cuponRepository.delete(id);

    }



  
   
 
  
    
}
