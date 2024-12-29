import { HttpException, HttpStatus, Injectable   } from '@nestjs/common';
 
import { InjectRepository } from '@nestjs/typeorm';
 
 
import { CreatecursoDto } from './dto/Create-Curso.dto';
 
import  storage = require('../utils/cloud_storage') ;
 
import { User } from 'src/users/user.entity';
 
import  PUSH = require('../utils/firebase_message') ;
import { dataestadoDto } from './dto/dataestado.dto';
 
import { Cursos } from './Cursos.entity';
import { Any, ArrayContains, Between, In, Like, Repository } from 'typeorm';
 
import { CategoryCursos } from 'src/categoriesCursos/categoryCursos.entity';
import { UpdateCursoDto } from './dto/update-Curso.dto';
import { Vimeo } from '@vimeo/vimeo';
import { CreatecursovideoDto } from './dto/Create-Curso-video.dto';
import { SectionCursos } from 'src/section/SectionCursos.entity';
import { Cursoresouce } from './dto/Cursoresouce.dto';
import { ConfigService } from '@nestjs/config';
import { DescuentoCursos } from 'src/descuento/descuentoCursos.entity';
import { filtroDto } from './dto/filtro.dto';
import { Cursoauthresouce } from 'src/auth/dto/Cursoauthresouce.dto';
import { contains } from 'class-validator';
import { title } from 'process';
import { Cursostudent } from 'src/studentcurso/Cursostudent.entity';
import { Updatecheck } from './dto/updatecheck.dto';
import { CursostudenresourceDto } from './dto/cursostuden.dto';
import { Reviews } from 'src/reviews/reviews.entity';
import { userresource } from './dto/userresource.dto';
 const fs=require('fs')
 const configService = new ConfigService();
 let client = new Vimeo(configService.get('CLIENT_IDENTIFIER') , configService.get('CLIENT_SECRET'),configService.get('SECRE_KEY_VIMEO'));

@Injectable()
export class CursosService {



constructor (@InjectRepository(Cursos) private cursoRepository: Repository<Cursos>,@InjectRepository(User) private usersRepository: Repository<User>,
 @InjectRepository(CategoryCursos) private categorycursoRepository: Repository<CategoryCursos>,
 @InjectRepository(SectionCursos) private seccioncursoRepository: Repository<SectionCursos>,
 @InjectRepository(Reviews) private reviewsRepository: Repository<Reviews>,
 @InjectRepository(Cursostudent) private cursostudentRepository: Repository<Cursostudent>,
 @InjectRepository(DescuentoCursos) private descuentocursoRepository: Repository<DescuentoCursos>){}







 
  
 

    async findAll( ){
    
    return this.cursoRepository.find({relations:['user','categorycurso','seciones.clases.files'],order: {
        id: "DESC" // "DESC"
    }})          
}


async findAlltienda( ){
    
    let cursosresp:Cursoresouce
    let cursosrespretu:any[]=[]
    let descuento_g:any
    let descuetos= await this.descuentocursoRepository.find({ });
   let cursos= await this.cursoRepository.find({relations:['user','categorycurso','seciones.clases.files'],take: 3}) 
   
   for (let curso of cursos) { 

    let i=0;
    curso.seciones.forEach((seccion) => {
       
     i=i+ seccion.clases.length;
      

    })
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
      
     const updatecurso= Object.assign(curso, cursosresp);
     if(descuento_g.id>0){
        updatecurso.discount_g=descuento_g
    }

    let N_STUDENTS_C=await this.cursostudentRepository.count({where:{id_curso:curso.id}})
    let REVIEWS_C=await this.reviewsRepository.find({where:{id_curso:curso.id}})
    let AVG_RATING_C = REVIEWS_C.length > 0 ? REVIEWS_C.reduce((sum,review) => sum + review.rating, 0)/REVIEWS_C.length : 0; 
    let NUM_REVIEW_C = REVIEWS_C.length;
    updatecurso.n_students=N_STUDENTS_C 
    updatecurso.num_review= NUM_REVIEW_C
    updatecurso.avg_rating=(AVG_RATING_C / NUM_REVIEW_C).toFixed(2);
    updatecurso.num_clases=i;
    
    cursosrespretu.push(updatecurso)

   }
    
    return cursosrespretu        



            
}



async findAlltiendabaner( ){
    
    return this.cursoRepository.find({relations:['user','categorycurso','seciones.clases.files'],take: 3,where:{}})          
}


async findAlltiendacategory(id_category:number ){
    let cursosresp:Cursoresouce
    let cursosrespretu:any[]=[]
    let descuento_g:any
    let descuetos= await this.descuentocursoRepository.find({ });
   let cursos= await this.cursoRepository.find({relations:['user','categorycurso','seciones.clases.files'],take: 3,where:{id_category_curso:id_category}}) 
  
 
    for(let curso of cursos){
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
     if(descuento_g!=null){
     if(descuento_g.id>0){
        updatecurso.discount_g=descuento_g
    }}
    let N_STUDENTS_C=await this.cursostudentRepository.count({where:{id_curso:curso.id}})
    let REVIEWS_C=await this.reviewsRepository.find({where:{id_curso:curso.id}})
    let AVG_RATING_C = REVIEWS_C.length > 0 ? REVIEWS_C.reduce((sum,review) => sum + review.rating, 0)/REVIEWS_C.length : 0; 
    let NUM_REVIEW_C = REVIEWS_C.length;
    updatecurso.n_students=N_STUDENTS_C 
    updatecurso.num_review= NUM_REVIEW_C
   updatecurso.avg_rating=(AVG_RATING_C / NUM_REVIEW_C).toFixed(2);
    updatecurso.num_clases=i;
    cursosrespretu.push(updatecurso)

   }
    
    return cursosrespretu         
}
//----------------------------------------------------


async findAlltiendauser(id_user:number ){
    let cursosresp:Cursoresouce
    let cursosrespretu:any[]=[]
    let descuento_g:any
    let descuetos= await this.descuentocursoRepository.find({ });
     let cursos = await this.cursoRepository.find({relations:['user','categorycurso','seciones.clases.files'],take: 3,where:{id_user:id_user}})        
 
    
    for (let curso of cursos ){
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
     if(descuento_g!=null){
     if(descuento_g.id>0){
        updatecurso.discount_g=descuento_g
    }}

     let N_STUDENTS_C=await this.cursostudentRepository.count({where:{id_curso:curso.id}})
      let REVIEWS_C=await this.reviewsRepository.find({where:{id_curso:curso.id}})
      let AVG_RATING_C = REVIEWS_C.length > 0 ? REVIEWS_C.reduce((sum,review) => sum + review.rating, 0)/REVIEWS_C.length : 0; 
      let NUM_REVIEW_C = REVIEWS_C.length;
      updatecurso.n_students=N_STUDENTS_C 
      updatecurso.num_review= NUM_REVIEW_C
     updatecurso.avg_rating=(AVG_RATING_C / NUM_REVIEW_C).toFixed(2);
    updatecurso.num_clases=i;


    updatecurso.num_clases=i;
    
    cursosrespretu.push(updatecurso)

   }
    
    return cursosrespretu    
    
      
}

 



async uploadvideo(file: Express.Multer.File,curso: CreatecursovideoDto):Promise<any>
{
    const cursoFound = await this.cursoRepository.findOneBy({id:curso.id})
       
     const resul= await this.uploadvideovimeo(file,curso);

        
    cursoFound.vimeo_id="https://player.vimeo.com/video/"+resul.split('/')[2];
    let savecurso= this.cursoRepository.save(cursoFound); 
   return await savecurso;    

}





async uploadvideovimeo(file: Express.Multer.File,curso: CreatecursovideoDto): Promise<any>
{
    return new Promise((resolve,reject)=>{

        client.upload(    
            file.path,
          {
            'name': curso.title,
            'description': curso.description
          },
              function (uri) {
            console.log('Your video URI is: ' + uri);
            fs.unlinkSync(file.path)
            resolve( uri);
            
              
          },
          function (bytes_ed, bytes_total) {
            var percentage = (bytes_ed / bytes_total * 100).toFixed(2)
            console.log(bytes_ed, bytes_total, percentage + '%')
          },
          function (error) {
            reject('Failed because: ' + error)
          }
        )

    })
   
 

     
    
    
    
   
     
    





}


    async findAllcurso(id_curso:number ){
      
        let descuento_g:any=''
        let descuetos= await this.descuentocursoRepository.find({ });
         descuetos.forEach((descuento) => {
            if(descuento.type_segment==1){
                descuento.courses.forEach((id) => {
                      if(id==id_curso)
                      {
                        descuento_g=descuento;
                      }
                })
            }else {
                descuento.categories.forEach((id) => {
                    if(id==id_curso)
                        { descuento_g=descuento;}
                })
            }
    
         
        })
    
    let cursosresp: Cursoresouce;
    
   let cursos= await this.cursoRepository.findOne({relations:['user','categorycurso','seciones.clases.files'],where: { 
        id: id_curso,
        
      }});
      const updatecurso= Object.assign(cursos, cursosresp);
     
      let i=0;
      let numeroclase=0;
      let timecurso:any[]=[]
      updatecurso.seciones.forEach((secione) => {
        let timeseccion:any[]=[]
        numeroclase+= secione.clases.length
        secione.clases.forEach((clase) => {
            timeseccion.push(clase.time)
            timecurso.push(clase.time)
        })
      
        updatecurso.seciones[i].time_parse= this.sumarTiempos(...timeseccion)
        
        i++
      })
      if(descuento_g.id>0){
        updatecurso.discount_g=descuento_g
    }
      updatecurso.time_parse= this.sumarTiempos(...timecurso)
      updatecurso.num_clases=numeroclase;
      
    return updatecurso



       
    
}

async findAllcursolanding(id_curso:number ,iduser:number=null){
     console.log(iduser)
  let cursostuden_have_course=false
  if(iduser)
  {
    let cursostudenresp=await this.cursostudentRepository.findOne({where:{id_curso:id_curso,id_user:iduser}})
     if(cursostudenresp){
        cursostuden_have_course=true
      }
  }


   
    let descuento_g:any=''
    let descuetos= await this.descuentocursoRepository.find({ });
     descuetos.forEach((descuento) => {
        if(descuento.type_segment==1){
            descuento.courses.forEach((id) => {
                  if(id==id_curso)
                  {
                    descuento_g=descuento;
                  }
            })
        }else {
            descuento.categories.forEach((id) => {
                if(id==id_curso)
                    { descuento_g=descuento;}
            })
        }

     
    })
     
    let cursosresp: Cursoresouce;
 
   
   let cursos= await this.cursoRepository.findOne({relations:['user','categorycurso','seciones.clases.files'],where: { 
        id: id_curso,
        
      }});

      const updatecurso= Object.assign(cursos, cursosresp);
     
      let i=0;
      let numeroclase=0;
      let timecurso:any[]=[]
      updatecurso.seciones.forEach((secione) => {
        let timeseccion:any[]=[]
        numeroclase+= secione.clases.length
        secione.clases.forEach((clase) => {
            timeseccion.push(clase.time)
            timecurso.push(clase.time)
        })
      
        updatecurso.seciones[i].time_parse= this.sumarTiempos(...timeseccion)
        
        i++
      })
      if(descuento_g.id>0){
        updatecurso.discount_g=descuento_g
    }
    let cursosprofesor = await this.cursoRepository.find({where:{id_user:updatecurso.id_user}})

    let N_STUDENTS_SUM_TOTAL = 0;
    let AVG_RATING_SUM_TOTAL = 0;
    let NUM_REVIEW_SUM_TOTAL = 0;
  
       
  
        for(let curso of cursosprofesor ){
          console.log(curso)
        let N_STUDENTS_C=await this.cursostudentRepository.count({where:{id_curso:curso.id}})
        let REVIEWS_C=await this.reviewsRepository.find({where:{id_curso:curso.id}})
        let AVG_RATING_C = REVIEWS_C.length > 0 ? REVIEWS_C.reduce((sum,review) => sum + review.rating, 0)/REVIEWS_C.length : 0; 
        let NUM_REVIEW_C = REVIEWS_C.length;
       
        N_STUDENTS_SUM_TOTAL += N_STUDENTS_C;
        NUM_REVIEW_SUM_TOTAL += NUM_REVIEW_C;
        AVG_RATING_SUM_TOTAL += AVG_RATING_C;


       if(curso.id==id_curso){
        updatecurso.n_students=N_STUDENTS_C 
        updatecurso.num_review= NUM_REVIEW_C
        updatecurso.avg_rating=(AVG_RATING_C / NUM_REVIEW_C).toFixed(2);

       }
        
       updatecurso.user.n_students=N_STUDENTS_SUM_TOTAL;
       updatecurso.user.num_review=NUM_REVIEW_SUM_TOTAL;
       updatecurso.user.avg_rating=(AVG_RATING_SUM_TOTAL / NUM_REVIEW_SUM_TOTAL).toFixed(2);
       updatecurso.user.count_course=cursosprofesor.length;
       
     
      }
     
 
  
//////////////////////////////////////////////////

      updatecurso.cursostuden_have_course= cursostuden_have_course; 
      updatecurso.time_parse= this.sumarTiempos(...timecurso)
      updatecurso.num_clases=numeroclase;
    return updatecurso



       
    
}


async updatecheck(updatecheck:Updatecheck ){

console.log(updatecheck)
  let COURSE_STUDENT_ID =  updatecheck.id

  let course_student = await this.cursostudentRepository.findOne({where:{id: COURSE_STUDENT_ID} })
     
   
  course_student.clases_checked=updatecheck.clases_checked
  course_student.state=updatecheck.state
  

  
return await  this.cursostudentRepository.save(course_student); 
  
}




async findAllvercursolanding(id_curso:number,iduser:number ){
       let COURSE = await this.cursoRepository.findOne({where:{id: id_curso}}) 
            if(!COURSE){
              throw new HttpException('el curso no se encuentra registrado ',HttpStatus.OK);

            }

            let course_student = await this.cursostudentRepository.findOne({where:{id_curso: COURSE.id,id_user: iduser}});

            if(!course_student){
              throw new HttpException('El curso no lo tienes registrado',HttpStatus.OK);
            }
   
  let descuento_g:any=''
  let descuetos= await this.descuentocursoRepository.find({ });
   descuetos.forEach((descuento) => {
      if(descuento.type_segment==1){
          descuento.courses.forEach((id) => {
                if(id==id_curso)
                {
                  descuento_g=descuento;
                }
          })
      }else {
          descuento.categories.forEach((id) => {
              if(id==id_curso)
                  { descuento_g=descuento;}
          })
      }

   
  })
   
  let cursosresp: Cursoresouce;


 
 let cursos= await this.cursoRepository.findOne({relations:['user','categorycurso','seciones.clases.files'],where: { 
      id: id_curso,
      
    }});

    const updatecurso= Object.assign(cursos, cursosresp);
    
    let i=0;
    let numeroclase=0;
    let timecurso:any[]=[]
    updatecurso.seciones.forEach((secione) => {
      let timeseccion:any[]=[]
      numeroclase+= secione.clases.length
      secione.clases.forEach((clase) => {
          timeseccion.push(clase.time)
          timecurso.push(clase.time)
      })
    
      updatecurso.seciones[i].time_parse= this.sumarTiempos(...timeseccion)
      
      i++
    })
    if(descuento_g.id>0){
      updatecurso.discount_g=descuento_g
  }
    
    
    updatecurso.time_parse= this.sumarTiempos(...timecurso)
    let cursosprofesor = await this.cursoRepository.find({where:{id_user:updatecurso.id_user}})
    
    
    
    let N_STUDENTS_SUM_TOTAL = 0;
    let AVG_RATING_SUM_TOTAL = 0;
    let NUM_REVIEW_SUM_TOTAL = 0;
  
       
      cursosprofesor.forEach(async (curso) => {
        let N_STUDENTS_C=await this.cursostudentRepository.count({where:{id_curso:curso.id}})
        let REVIEWS_C=await this.reviewsRepository.find({where:{id_curso:curso.id}})
        let AVG_RATING_C = REVIEWS_C.length > 0 ? REVIEWS_C.reduce((sum,review) => sum + review.rating, 0)/REVIEWS_C.length : 0; 
        let NUM_REVIEW_C = REVIEWS_C.length;
       
        N_STUDENTS_SUM_TOTAL += N_STUDENTS_C;
        NUM_REVIEW_SUM_TOTAL += NUM_REVIEW_C;
        AVG_RATING_SUM_TOTAL += AVG_RATING_C;


       if(curso.id==id_curso){
        updatecurso.n_students=N_STUDENTS_C 
        updatecurso.num_review= NUM_REVIEW_C
        updatecurso.avg_rating=(AVG_RATING_C / NUM_REVIEW_C).toFixed(2);

       }
        
       updatecurso.user.n_students=N_STUDENTS_SUM_TOTAL;
       updatecurso.user.num_review=NUM_REVIEW_SUM_TOTAL;
       updatecurso.user.avg_rating=(AVG_RATING_SUM_TOTAL / NUM_REVIEW_SUM_TOTAL).toFixed(2);
       updatecurso.user.count_course=cursosprofesor.length;
       
     
      })
     
     
    
    
     

      
     
    updatecurso.coursestudent= await this.cursostudentRepository.findOneBy( {id_curso:updatecurso.id,id_user:iduser})
    updatecurso.num_clases=numeroclase;
   
    console.log(updatecurso)
   
    
    
 
    return updatecurso



     
  
}



   
sumarTiempos(...tiempos) {
    // Convierte cada tiempo en formato "hh:mm:ss" a segundos y suma todos los segundos.
    const totalSegundos = tiempos.reduce((total, tiempo) => {
      const [horas, minutos, segundos] = tiempo.split(':').map(Number);
      return total + horas * 3600 + minutos * 60 + segundos;
    }, 0);
  
    // Convierte los segundos totales a formato "hh:mm:ss".
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;
  
    // Retorna el resultado formateado.
    return `${horas} horas ${minutos} minutos ${segundos} segundos`;
  }
 
     



 







 

 




async create(file: Express.Multer.File,curso: CreatecursoDto){   
    
   
      
      
       

      
       const newcurso = this.cursoRepository.create(curso);
         
       const url =await storage(file,file.originalname);
      
       if(url ===undefined && url === null)
       {
         throw new HttpException('La imagen no se pudo guardar ',HttpStatus.INTERNAL_SERVER_ERROR);
       }
    
        newcurso.imagen=url
        newcurso.slug=newcurso.title
        newcurso.estado=1
         
        
      
       const savecurso= await this.cursoRepository.save(newcurso);
   
          return  savecurso;
   }





   async updateWithImage( file: Express.Multer.File,curso: UpdateCursoDto){   
 
    const url =await storage(file,file.originalname);
     
    if(url ===undefined && url === null)
    {
      throw new HttpException('La imagen no se pudo guardar ',HttpStatus.INTERNAL_SERVER_ERROR);
    }
       
        
       curso.imagen=url;
       
       const updateproduct = await this.update( curso);
      
    
    return updateproduct;

   }


    async update( curso: UpdateCursoDto){
    
        
     const cursoFound = await this.cursoRepository.findOneBy({id:curso.id})
    
   if (!cursoFound ){
    throw new HttpException("producto no encontrado",HttpStatus.NOT_FOUND);

   }
    

   delete curso.id;
   const updatecurso= Object.assign(cursoFound, curso);
      
   
     this.cursoRepository.save(updatecurso);
   
      return new HttpException("curso editado correctamente",HttpStatus.OK);
    }




 

    async delete(id: number){
        const productsFound = await this.cursoRepository.findOneBy({id:id})
      if (!productsFound ){
       throw new HttpException("producto no encontrado",HttpStatus.NOT_FOUND);

 } 
      return this.cursoRepository.delete(id);
   
       }


 async config_filtro(){
  

  let categories = await this.categorycursoRepository.find({where:{estado: 1}});
  let N_CATEGORIES = [];
  for (let categorie of categories) {
      let categorie1:any=categorie
      categorie1.count_course = await this.cursoRepository.count({where:{id_category_curso: categorie.id}});
      N_CATEGORIES.push(categorie);
  }
  let instructores = await this.usersRepository.find({where:{roles:{id:"PROF"},estado: 1}});
  let N_INSTRUCTORS = [];
  for (let instructor of instructores) {
      let instructor1:any=instructor
      instructor1.count_course = await this.cursoRepository.count({where:{id_user:instructor.id}});
      N_INSTRUCTORS.push(instructor);
  }
  let levels = ['Basico',
      'Intermedio',
      'Avanzado'];
  let N_LEVELS = [];
  for (const level of levels) {
      let count_course = await this.cursoRepository.count({where:{level: level}});
      N_LEVELS.push({
          name: level,
          count_course: count_course,
      });
  }
  let idiomas = ['Ingles',
      'Español',
      'Portugues',
      'Aleman'];
  let N_IDIOMAS = [];
  for (const idioma of idiomas) {
      let count_course = await this.cursoRepository.count({where:{idioma: idioma}});
      N_IDIOMAS.push({
          name: idioma,
          count_course: count_course,
      });
  }
 
return await{
      categories: N_CATEGORIES,
      instructores: N_INSTRUCTORS,
      levels: N_LEVELS,
      idiomas: N_IDIOMAS,
  }

 }



 /////////////////////////////////////////////////filtro

async search_curso(filtro:filtroDto)
{
  console.log(filtro)
  let cursosrespretu:any[]=[]
  let TIME_NOW = 'req.query.TIME_NOW';
  let search_course = filtro.search;

  let selected_categories:any =filtro.selected_categories;
  
  let selected_instructors:any =filtro.selected_instructors;
   

  let selected_levels:any = filtro.selected_levels;//["Basico","Intermedio"]
  let selected_idiomas:any =filtro.selected_idiomas

  let min_price = filtro.min_price
  let max_price = filtro.max_price
  let rating_selected = filtro.rating_selected//2

  let filters:any =  {
    estado:2,
    id_user:In(selected_instructors),
    idioma:In(selected_idiomas),
    level:In(selected_levels),
    id_category_curso:In(selected_categories),
    title:Like(`%${search_course}%`),
    price_usd:Between(min_price, max_price)
     };
  if(!search_course ){
    delete filters.title
  } 
  if(!selected_categories || !selected_categories.length  ){
      delete filters.id_category_curso
        

  }

  if(!selected_idiomas || !selected_idiomas.length   ){
    delete filters.idioma
}

if(!selected_instructors || !selected_instructors.length   ){
  delete filters.id_user
}


  
  if(!selected_levels || !selected_levels.length   ){
    delete filters.level
  }

  
  if(!min_price    && !max_price ){
    delete filters.price_usd
    
  }
  
  console.log(filters)
   
 
  
 
  let Courses = await this.cursoRepository.find({relations:['user','categorycurso','seciones.clases.files'],where:filters}
      
       
  );

  // CAMPAING NORMAL


  
    let descuetos= await this.descuentocursoRepository.find({ });
              
  
  for (const Course of Courses) {
      let DISCOUNT_G = null;

      descuetos.forEach((descuento) => {
        if(descuento.type_segment==1){
            descuento.courses.forEach((id) => {
                  if(id==Course.id)
                  {
                    DISCOUNT_G=descuento;
                  }
            })
        }else {
            descuento.categories.forEach((id) => {
                if(id==Course.id)
                    { DISCOUNT_G=descuento;}
            })
        }

     
    })
       
     
      let numeroclase=0; 
      Course.seciones.forEach((secione) => {
         numeroclase+= secione.clases.length
       })
      let N_CLASES =numeroclase;
      let curso:Cursoauthresouce
      const cursoresp= Object.assign(Course, curso);
      cursoresp.n_clases=N_CLASES
      cursoresp.discount_g= DISCOUNT_G





      let N_STUDENTS_C=await this.cursostudentRepository.count({where:{id_curso:cursoresp.id}})
      let REVIEWS_C=await this.reviewsRepository.find({where:{id_curso:cursoresp.id}})
      let AVG_RATING_C = REVIEWS_C.length > 0 ? REVIEWS_C.reduce((sum,review) => sum + review.rating, 0)/REVIEWS_C.length : 0; 
      let NUM_REVIEW_C = REVIEWS_C.length;
      cursoresp.n_students=N_STUDENTS_C 
      cursoresp.num_review= NUM_REVIEW_C
      cursoresp.avg_rating=(AVG_RATING_C / NUM_REVIEW_C).toFixed(2);
      
      
      cursosrespretu.push(cursoresp)
      
      
  }

  return cursosrespretu;

}

        
//////////////////////////////////////filtro
       
      
}
