import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-categoryDto';
import  storage = require( '../utils/cloud_storage');
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { updatecategoryDto } from './dto/update-categoryDto';
import { User } from 'src/users/user.entity';



@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category) private categoriesRepository: Repository<Category>,@InjectRepository(User) private usersRepository: Repository<User>
    ){}

    async findall(idclient){

      
      const userfound= await this.usersRepository.findOneBy({id: idclient});
    
      if(userfound.estado==0)
      {
          
             throw new HttpException('usuario desactivado',HttpStatus.NOT_FOUND);
          
      }
        return this.categoriesRepository.find();
    }

   

    async create(file: Express.Multer.File,category:CreateCategoryDto){
       let newcategory = this.categoriesRepository.create(category);
       newcategory.notification=0;
       newcategory.numero_senales=0;
      const url = await  storage(file,file.originalname);
      if(url ===undefined && url === null)
      {
        throw new HttpException('La imagen no se pudo guardar ',HttpStatus.INTERNAL_SERVER_ERROR);
      }
      newcategory.image=url;
      return this.categoriesRepository.save(newcategory);
    }


    async updateWithImage(file: Express.Multer.File,id: number,category:updatecategoryDto){
        
       const url = await  storage(file,file.originalname);
       if(url ===undefined && url === null)
       {
         throw new HttpException('La imagen no se pudo guardar ',HttpStatus.INTERNAL_SERVER_ERROR);
       }
       const categorifound= await this.categoriesRepository.findOneBy({id: id})
       if(!categorifound){
        throw new HttpException('la categoria no se encuentra ',HttpStatus.NOT_FOUND);

       }
       
      
      category.image=url;
      const updatecategory = Object.assign(categorifound,category);
       return this.categoriesRepository.save(updatecategory);
     }




     async update( id: number,category:updatecategoryDto){
        
       
        const categorifound= await this.categoriesRepository.findOneBy({id: id})
        if(!categorifound){
         throw new HttpException('la categoria no se encuentra ',HttpStatus.NOT_FOUND);
 
        }
         const updatecategory = Object.assign(categorifound,category);
        return this.categoriesRepository.save(updatecategory);
      }

      async delete(id: number){

        const categorifound = await this.categoriesRepository.findOneBy({id: id})
        if(!categorifound){
            throw new HttpException('la categoria no se encuentra ',HttpStatus.NOT_FOUND);
    
           }
       
        return this.categoriesRepository.delete(id);

    }


    

}
