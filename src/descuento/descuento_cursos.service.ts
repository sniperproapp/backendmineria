import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
 
import { InjectRepository } from '@nestjs/typeorm';
import {   Any, In, Repository } from 'typeorm';
 
import { User } from 'src/users/user.entity';
import { DescuentoCursos } from './descuentoCursos.entity';
import { CreatedescuentoCursosDto } from './dto/create-descuentoCursosDto';
import { updatedescuentoCursosDto } from './dto/update-descuentoCursosDto';
import { Cursos } from 'src/cursos/Cursos.entity';
import { DescuentoCursosDto } from './dto/descuentoCursosDto';
import { Cursoresouceseccion } from './dto/Cursoresouceseccion.dto';
import { Reviews } from 'src/reviews/reviews.entity';
import { Cursostudent } from 'src/studentcurso/Cursostudent.entity';
 
 
 
function formDateToYMD(date,type=1) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2,'0');//07 08 09

  const day =  String(date.getDate()).padStart(2,'0');// 2 ,3 ,4
  if(type == 1){
      return day+"/"+month+"/"+year; // 01/03/2023
  }
  return year+"-"+month+"-"+day; // 01/03/2023
}
 

 
@Injectable()
export class descuentoCursosService {
    constructor(
        @InjectRepository(DescuentoCursos) private descuentoRepository: Repository<DescuentoCursos>
        ,@InjectRepository(Cursos) private cursosRepository: Repository<Cursos>
        ,@InjectRepository(Cursostudent) private cursostudentRepository: Repository<Cursostudent>
        ,@InjectRepository(Reviews) private reviewsRepository: Repository<Reviews>,
    ){}

    async findAll(code:string){
      if(code=="alldescuentoes"){
        return  this.descuentoRepository.find(  );
      }else{

      }
        return  this.descuentoRepository.find( {  where:{}} );
    }
    


    
    async findAlltiendabaner(  ){
       
      const  descueto= await this.descuentoRepository.findOneBy( { type_campaign:3} );
        
       let discountresul:DescuentoCursosDto ;
       let cursos:any[]=[];
        let curso:Cursoresouceseccion;
       

       if(!descueto){
        throw new HttpException('no hay cursos disponibles en banner ',HttpStatus.OK);
      }
      
      const updateddescuento = Object.assign(descueto,discountresul);
        for(let cursoid of  descueto.courses ){
              let cursoresp=await this.cursosRepository.findOne({relations:['user','categorycurso','seciones.clases.files'],where:{ id:cursoid}});
               let i=0;
              cursoresp.seciones.forEach((seccion) => {
                 
               i=i+ seccion.clases.length;
                

              })
            const updatecurso= Object.assign(cursoresp,curso );
               
            let N_STUDENTS_C=await this.cursostudentRepository.count({where:{id_curso:cursoid}})
            let REVIEWS_C=await this.reviewsRepository.find({where:{id_curso:cursoid}})
            let AVG_RATING_C = REVIEWS_C.length > 0 ? REVIEWS_C.reduce((sum,review) => sum + review.rating, 0)/REVIEWS_C.length : 0; 
            let NUM_REVIEW_C = REVIEWS_C.length;
            updatecurso.n_students=N_STUDENTS_C 
            updatecurso.num_review= NUM_REVIEW_C
            updatecurso.avg_rating=(AVG_RATING_C / NUM_REVIEW_C).toFixed(2);
              
               updatecurso.num_clases=i;
               
              cursos.push(updatecurso)
          }
        
          
         
      updateddescuento.courses=cursos;
       return updateddescuento;
    }




    async findAlltiendaflash(  ){
      
       let curso:Cursoresouceseccion;
      const  descueto= await this.descuentoRepository.findOneBy( { type_campaign:2} );
        
       let discountresul:DescuentoCursosDto ;
       let cursos:any[]=[];
       

       if(!descueto){
        throw new HttpException('no hay cursos disponibles en flash ',HttpStatus.OK);
      }
      
      const updateddescuento = Object.assign(descueto,discountresul);
        for(let cursoid of  descueto.courses ){
            let cursoresp=await this.cursosRepository.findOne({relations:['user','categorycurso','seciones.clases.files'],where:{ id:cursoid}});
           

            let i=0;
            cursoresp.seciones.forEach((seccion) => {
               
             i=i+ seccion.clases.length;
              

            })
            const updatecurso= Object.assign(cursoresp,curso );
          

            let N_STUDENTS_C=await this.cursostudentRepository.count({where:{id_curso:cursoid}})
            let REVIEWS_C=await this.reviewsRepository.find({where:{id_curso:cursoid}})
            let AVG_RATING_C = REVIEWS_C.length > 0 ? REVIEWS_C.reduce((sum,review) => sum + review.rating, 0)/REVIEWS_C.length : 0; 
            let NUM_REVIEW_C = REVIEWS_C.length;
            updatecurso.n_students=N_STUDENTS_C 
            updatecurso.num_review= NUM_REVIEW_C
            updatecurso.avg_rating=(AVG_RATING_C / NUM_REVIEW_C).toFixed(2);
            updatecurso.num_clases=i;

            
           cursos.push(updatecurso)
          }
        
          
          
      updateddescuento.courses=cursos;
      updateddescuento.start_datenew=formDateToYMD(updateddescuento.start_date,1);
      updateddescuento.end_datenew=formDateToYMD(updateddescuento.end_date,1);
      updateddescuento.end_dateclok=formDateToYMD(updateddescuento.end_date,2);
       return updateddescuento;
    }



      
    async findone(id:number){

      const categorifound= await this.descuentoRepository.findOneBy({id:id})
      if(!categorifound){
       throw new HttpException('el descuento no se encuentra registrado ',HttpStatus.OK);

      }
      
   
        return  this.descuentoRepository.findOneBy( {  id:id} );
    } 
     
       
    

   

    async create(  descuento: CreatedescuentoCursosDto){

 
      try {
        console.log(descuento)

        let filterA = [];// PARA ENCONTRAR CONCIDENCIA A NIVEL DE FECHA DE INICIO
        let filterB = [];// PARA ENCONTRAR CONCIDENCIA A NIVEL DE FECHA DE FIN
        // courses_s = ["dasdasdasd","dasdasdasdas"] [{_id: laravel y angular },{_id: vue y laravel}]
        // categories_s = ["dasdasdasd","dasdasdasdas"]
        if(descuento.type_segment == 1){//CURSOS
            // FILTRAR POR CURSOS EXISTENTE EN OTRAS CAMPAÑA DE DESCUENTO
            filterA=descuento.courses_s 
            filterB=  descuento.courses_s 
        }else{//CATEGORIAS
            // FILTRAR POR CATEGORIAS EXISTENTE EN OTRAS CAMPAÑA DE DESCUENTO
            filterA= descuento.categories_s 
            
            filterB=descuento.categories_s
          }

        // nos falta
        // filterA.push({
        //     type_campaign: descuento.type_campaign,
        //     start_date_num: {$gte: descuento.start_date_num,$lte: descuento.end_date_num},
        // });

        // filterB.push({
        //     type_campaign: descuento.type_campaign,
        //     end_date_num: {$gte: descuento.start_date_num,$lte: descuento.end_date_num},
        // });

       let exists_start_date = await this.descuentoRepository.find({where:[ {courses: In(descuento.courses_s)},{ type_campaign: descuento.type_campaign}]});

       let exists_end_date = await this.descuentoRepository.find({where:[ {courses: In(descuento.courses_s)},{ type_campaign: descuento.type_campaign}]});

        if(exists_start_date.length > 0 || exists_end_date.length > 0){
          console.log('entroaqui');
          throw new HttpException("EL DESCUENTO NO SE PUEDE REGISTRAR PORQUE HAY DUPLICIDAD",HttpStatus.OK);
          
            
           
        }
        // registrar el descuento

        let newdescuento = this.descuentoRepository.create( descuento);
        return this.descuentoRepository.save(newdescuento);
        
    } catch (error) {
        console.log(error);
        throw new HttpException(error.response,HttpStatus.OK);
         
    }

  }


     




     async update( id: number,descuento:updatedescuentoCursosDto){
        
      
      let filterA = [];// PARA ENCONTRAR CONCIDENCIA A NIVEL DE FECHA DE INICIO
        let filterB = [];// PARA ENCONTRAR CONCIDENCIA A NIVEL DE FECHA DE FIN
        // courses_s = ["dasdasdasd","dasdasdasdas"] [{_id: laravel y angular },{_id: vue y laravel}]
        // categories_s = ["dasdasdasd","dasdasdasdas"]
        if(descuento.type_segment == 1){//CURSOS
            // FILTRAR POR CURSOS EXISTENTE EN OTRAS CAMPAÑA DE DESCUENTO
            filterA=descuento.courses_s 
            filterB=  descuento.courses_s 
        }else{//CATEGORIAS
            // FILTRAR POR CATEGORIAS EXISTENTE EN OTRAS CAMPAÑA DE DESCUENTO
            filterA= descuento.categories_s 
            
            filterB=descuento.categories_s
          }


          
       let exists_start_date = await this.descuentoRepository.find({where:[ {courses: In(descuento.courses_s)},{ type_campaign: descuento.type_campaign}]});

       let exists_end_date = await this.descuentoRepository.find({where:[ {courses: In(descuento.courses_s)},{ type_campaign: descuento.type_campaign}]});

        // if(exists_start_date.length > 0 || exists_end_date.length > 0){
        //   console.log('entroaqui');
        //   throw new HttpException("EL DESCUENTO NO SE PUEDE EDITAR PORQUE HAY DUPLICIDAD",HttpStatus.OK);
          
            
           
        // }

        const categorifound= await this.descuentoRepository.findOneBy({id: id})
        if(!categorifound){
         throw new HttpException('la categoria no se encuentra ',HttpStatus.OK);
 
        }
        

         delete descuento.id;
         const updateddescuento = Object.assign(categorifound,descuento);
        return this.descuentoRepository.save(updateddescuento);
      }

      async delete(id: number){

        const categorifound = await this.descuentoRepository.findOneBy({id: id})
        if(!categorifound){
            throw new HttpException('la categoria no se encuentra ',HttpStatus.NOT_FOUND);
    
           }
       
        return this.descuentoRepository.delete(id);

    }



  
   
 
  
    
}
