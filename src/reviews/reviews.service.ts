import { HttpException, HttpStatus, Injectable   } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';  
import { User } from 'src/users/user.entity';  
 
 
import { CuponCursos } from 'src/cupones/cuponCursos.entity';
 
import { Reviews } from './reviews.entity';
import { CreatereviewsRepository } from './dto/Create-CreatereviewsDto.dto';
import { Repository } from 'typeorm';
import { UpdateReviewsDto } from './dto/update-Curso.dto';
import { reviewinfo } from './dto/reviewinfo.dto';
 
 
  
@Injectable()
export class ReviewsService {



constructor (@InjectRepository(Reviews) private reviewsRepository: Repository<Reviews>,@InjectRepository(User) private usersRepository: Repository<User>,
 
 @InjectRepository(CuponCursos) private cuponreviewsRepository: Repository<CuponCursos>){}







 
  
 

    async findAll( iduser:number){
    
    return this.reviewsRepository.find({relations:['user'], where:{id:iduser},order: {
        id: "DESC" // "DESC"
    }})          
}




async findreviewsAll( id:number){
    let respuestareviews: reviewinfo[]=[]
 let reviews=await this.reviewsRepository.find({relations:['user'],  where:{id_curso:id},order: {
      id: "DESC" // "DESC"
  }})     
  
  for(let review of reviews)
  {
      respuestareviews.push({
        name: review.user.name,
        description: review.description,
        rating: review.rating,
        imagen: review.user.imagen
      })

  }
  return respuestareviews
}



async findreviewsAllreviews( ){
  let respuestareviews: reviewinfo[]=[]
let reviews=await this.reviewsRepository.find({relations:['user'],order: {
    id: "DESC" // "DESC"
}})     

for(let review of reviews)
{
    respuestareviews.push({
      name: review.user.name,
      description: review.description,
      rating: review.rating,
      imagen: review.user.imagen
    })

}
return respuestareviews
}
 
   


async create(review:CreatereviewsRepository  ){   
    
   console.log(review)
  const reviewfound= await this.reviewsRepository.findOne({where:{id_saledetail:review.id_saledetail,id_curso:review.id_curso,id_user:review.id_user}}  )
  if(reviewfound){
     throw new HttpException('el review ya se encuentra registrado ',HttpStatus.OK);

    }
  
   let newreview = this.reviewsRepository.create( review);
   return  await this.reviewsRepository.save(newreview);
   
   
   
      
      
       

      
       
    
        
        
      
       
   
          
   }


 
    async update(review:UpdateReviewsDto ){
  
        // PORQUE VA FUNCIONAR COMO APLICACION DE CUPON}
       
        let reviewsfound = await this.reviewsRepository.findOne({where:{id:review.id}});
        if(!reviewsfound){
          throw new HttpException('el reviews no se encuentra registrado ',HttpStatus.OK);
         
        }
        
         
        
        delete review.id;
        const updateddescuento = Object.assign(reviewsfound,review);
       
        return   await this.reviewsRepository.save(updateddescuento);
 

  
}
    

 
 

    async delete(id: number){
        const productsFound = await this.reviewsRepository.findOneBy({id:id})
      if (!productsFound ){
       throw new HttpException("producto no encontrado",HttpStatus.NOT_FOUND);

 } 
      return this.reviewsRepository.delete(id);
   
       }


 


        

       
      
}
