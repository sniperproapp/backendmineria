import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
 
import  storage = require( '../utils/cloud_storage');
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
 
import { User } from 'src/users/user.entity';
import { CategoryCursos } from './categoryCursos.entity';
 
import { updatecategoryCursosDto } from './dto/update-categoryCursosDto';
import { Cursos } from 'src/cursos/Cursos.entity';
import { CreateCategoryCursosDto } from './dto/create-categoryCursosDto copy';
import { CategoryCursosDto } from './dto/categoryCursosDto';
import { CategoryCursosResouceDto } from './dto/categoryCursosresouceDto';
import { DescuentoCursos } from 'src/descuento/descuentoCursos.entity';
import { Cursoresoucecategori } from './dto/Cursoresoucecategori.dto';
import { Reviews } from 'src/reviews/reviews.entity';
import { Cursostudent } from 'src/studentcurso/Cursostudent.entity';
import { id_developer } from 'src/config/env';



@Injectable()
export class CategoriesCursosService {
    constructor(
      @InjectRepository(CategoryCursos) private categoriesRepository: Repository<CategoryCursos>,
       @InjectRepository(Cursos) private cursosRepository: Repository<Cursos>
       ,@InjectRepository(User) private usersRepository: Repository<User>,
       @InjectRepository(Reviews) private reviewsRepository: Repository<Reviews>,
       @InjectRepository(Cursostudent) private cursostudentRepository: Repository<Cursostudent>
       ,@InjectRepository(DescuentoCursos) private descuentocursoRepository: Repository<DescuentoCursos>
    ){}

    async findall(busqueda:string){
      if(busqueda=='allcategorie'){
        return this.categoriesRepository.find();
    }
    else{
        return this.categoriesRepository.find({where:{titulo:Like('%'+busqueda+'%')}});
    }  
       
    }

   
    async findalltienda(busqueda:string){
      if(busqueda=='allcategorie'){
         let categoriasresul:CategoryCursosDto[]=[];
         let categories=await this.categoriesRepository.find({where:{estado:1}});
         
          for(let categoria of  categories ){
            let numerocursos=await this.cursosRepository.count({where:{id_category_curso:categoria.id}});

            categoriasresul.push({ id: categoria.id,titulo: categoria.titulo,estado: categoria.estado
              ,count_curso:numerocursos ,image:categoria.image,
              created_at: categoria.created_at,updated_at: categoria.updated_at })
          }

        return categoriasresul;
    }
    else{
        return this.categoriesRepository.find({where:{titulo:Like('%'+busqueda+'%')}});
    }
  }



     
  async findalltiendacategoriacursos(){
    let cursosresp:Cursoresoucecategori
    let N_STUDENTS_C
    let descuento_g:any
    let categoriasresul:CategoryCursosResouceDto[]=[];
    let categories=await this.categoriesRepository.find({relations:['cursos.seciones.clases.files'],where:{estado:1}});
    let descuetos= await this.descuentocursoRepository.find({ });

    for(let categoria of  categories ){
      let cursosrespretu:any[]=[]   
      for(let curso of    categoria.cursos ){  
   
        descuetos.forEach((descuento) => {
           if(descuento.type_segment==1){
               descuento.courses.forEach((id) => {
                     if(id==curso.id)
                     {
                       descuento_g=descuento;
                     }
               })
           }else {
               descuento.categories.forEach((id) => {
                   if(id==curso.id)
                       { descuento_g=descuento;}
               })
           }
        })

        let i=0;
        curso.seciones.forEach((seccion) => {
           
         i=i+ seccion.clases.length;
          
    
        })
         
        const updatecurso= Object.assign(curso, cursosresp);
        if(descuento_g){
          updatecurso.discount_g=descuento_g
       }
        N_STUDENTS_C= await this.cursostudentRepository.count({where:{id_curso:curso.id}})
       let REVIEWS_C=await this.reviewsRepository.find({where:{id_curso:curso.id}})
       let AVG_RATING_C = REVIEWS_C.length > 0 ? REVIEWS_C.reduce((sum,review) => sum + review.rating, 0)/REVIEWS_C.length : 0; 
       let NUM_REVIEW_C = REVIEWS_C.length;
       updatecurso.n_students=N_STUDENTS_C 
       updatecurso.num_review= NUM_REVIEW_C
       updatecurso.avg_rating=(AVG_RATING_C / NUM_REVIEW_C).toFixed(2);
        updatecurso.num_clases=i;
   
       
       cursosrespretu.push(updatecurso)

   
      }

       
       
 
      

      categoriasresul.push({ id: categoria.id,titulo: categoria.titulo,estado: categoria.estado
        ,count_curso:categoria.cursos.length ,image:categoria.image,
        created_at: categoria.created_at,
        updated_at: categoria.updated_at,cursos:cursosrespretu
        ,titulosinespacio:categoria.titulo.replace(/\s+/g,"") }) 
    }

return categoriasresul;

   
    
    
 
  
  
    
    
     
     
       
  
  
      
  
}






    async create(file: Express.Multer.File,category:CreateCategoryCursosDto){

      const categorifound= await this.categoriesRepository.findOneBy({titulo:category.titulo})
      if(categorifound){
       throw new HttpException('1',HttpStatus.OK);

      }
       let newcategory = this.categoriesRepository.create(category);
 
     
      const url = await  storage(file,file.originalname);
      if(url ===undefined && url === null)
      {
        throw new HttpException('La imagen no se pudo guardar ',HttpStatus.INTERNAL_SERVER_ERROR);
      }
      newcategory.image=url;
      return this.categoriesRepository.save(newcategory);
    }


    async updateWithImage(file: Express.Multer.File,id: number,category:updatecategoryCursosDto){
       
       const url = await  storage(file,file.originalname);
       if(url ===undefined && url === null)
       {
         throw new HttpException('La imagen no se pudo guardar ',HttpStatus.INTERNAL_SERVER_ERROR);
       }
       const categorifound= await this.categoriesRepository.findOneBy({id: id})
       if(!categorifound){
        throw new HttpException('la categoria no se encuentra ',HttpStatus.NOT_FOUND);

       }
       delete category.id;
      
      category.image=url;
      const updatecategory = Object.assign(categorifound,category);
       return this.categoriesRepository.save(updatecategory);
     }




     async update( id: number,category:updatecategoryCursosDto){
        
       
        const categorifound= await this.categoriesRepository.findOneBy({id: id})
        if(!categorifound){
         throw new HttpException('la categoria no se encuentra ',HttpStatus.NOT_FOUND);
 
        }
        
        delete categorifound.id;
        
         
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
