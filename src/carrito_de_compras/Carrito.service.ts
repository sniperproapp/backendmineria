import { HttpException, HttpStatus, Injectable   } from '@nestjs/common';
 
import { InjectRepository } from '@nestjs/typeorm';
 
 
 
 
import  storage = require('../utils/cloud_storage') ;
 
import { User } from 'src/users/user.entity';
 
 
 
 
import { Repository } from 'typeorm';
 
import { CategoryCursos } from 'src/categoriesCursos/categoryCursos.entity';
import { UpdateCursoDto } from './dto/update-Curso.dto';
 
 
import { SectionCursos } from 'src/section/SectionCursos.entity';
import { Cursoresouce } from './dto/Cursoresouce.dto';
 
import { DescuentoCursos } from 'src/descuento/descuentoCursos.entity';
import { Cursos } from 'src/cursos/Cursos.entity';
import { Carrito } from './Carrito.entity';
import { CreateCarritoDto } from './dto/Create-carrito.dto';
import { CuponCursos } from 'src/cupones/cuponCursos.entity';
 
  
@Injectable()
export class CarritoService {



constructor (@InjectRepository(Carrito) private carritoRepository: Repository<Carrito>,@InjectRepository(User) private usersRepository: Repository<User>,
 @InjectRepository(CategoryCursos) private categorycarritoRepository: Repository<CategoryCursos>,
 @InjectRepository(SectionCursos) private seccioncarritoRepository: Repository<SectionCursos>,
 @InjectRepository(CuponCursos) private cuponcarritoRepository: Repository<CuponCursos>){}







 
  
 

    async findAll( iduser:number){
    
    return this.carritoRepository.find({relations:['curso'], where:{id_user:iduser},order: {
        id: "DESC" // "DESC"
    }})          
}

 
   


async create(carrito:CreateCarritoDto,idUser:number ){   
    
   
  const categorifound= await this.carritoRepository.findOne({where:{id_user:idUser,id_curso:carrito.id_curso}})
  if(categorifound){
     throw new HttpException('el curso ya se encuentra registrado ',HttpStatus.OK);

    }
  carrito.id_user=idUser;
   let newcarrito = this.carritoRepository.create( carrito);
   const newcarritores= await this.carritoRepository.save(newcarrito);
   const newcarritoresr= await this.carritoRepository.findOne({relations:['curso'],where:{id:newcarritores.id}})
   
  return newcarritoresr
      
      
       

      
       
    
        
        
      
       
   
          
   }


 
    async update( iduser: number,cupon:string){
  
        // PORQUE VA FUNCIONAR COMO APLICACION DE CUPON}
        let user = iduser
        let CUPON = await this.cuponcarritoRepository.findOne({where:{code:cupon}});
        if(!CUPON){
          throw new HttpException('el cupon no se encuentra registrado ',HttpStatus.OK);
         
        }
        let carts = await this.carritoRepository.find({relations:['curso'],where:{id_user: user}})
        let courses = [];
        let categories = [];
        let carritofound
        CUPON.courses.forEach((id) => {
            courses.push(id);
        });//["123","124"]

        CUPON.categories.forEach((id) => {
            categories.push(id);
        })
        // ["125","126","123"]
        for (const cart of carts) {
            if(courses.length > 0){
                if(courses.includes(cart.curso.id+"")){
                    // EL % O $ D DESCUENTO
                    let subtotal = 0;
                    let total = 0;
                    if(CUPON.type_discount == 1){//% 30 40
                        subtotal = cart.price_unit - cart.price_unit*(CUPON.discount*0.01);
                    }else{//$
                        subtotal = cart.price_unit - CUPON.discount;
                    }
                    total = subtotal;
                    cart.subtotal= subtotal,
                    cart.total= total,
                    cart.type_discount= CUPON.type_discount,
                    cart.discount= CUPON.discount,
                    cart.code_cupon=cupon,
                    cart.campaign_discount= null,
                    cart.code_discount= null,
                         carritofound= await this.carritoRepository.findOneBy({id:cart.id})
                    if(!carritofound){
                     throw new HttpException('la carritoa no se encuentra ',HttpStatus.OK);
             
                    }
                    
            
                     delete cart.id;
                     const updateddescuento = Object.assign(carritofound,cart);
                     await this.carritoRepository.save(updateddescuento);



                }
            }
            if(categories.length > 0){
                if(categories.includes(cart.curso.id+"")){
                    // EL % O $ D DESCUENTO
                    let subtotal = 0;
                    let total = 0;
                    if(CUPON.type_discount == 1){//% 30 40
                        subtotal = cart.price_unit - cart.price_unit*(CUPON.discount*0.01);
                    }else{//$
                        subtotal = cart.price_unit - CUPON.discount;
                    }
                    total = subtotal;
                    cart.subtotal= subtotal,
                    cart.total= total,
                    cart.type_discount= CUPON.type_discount,
                    cart.discount= CUPON.discount,
                    cart.code_cupon=cupon,
                    cart.campaign_discount= null,
                    cart.code_discount= null,
                       carritofound= await this.carritoRepository.findOne({where:{id:cart.id}});
                    if(!carritofound){
                     throw new HttpException('la carritoa no se encuentra ',HttpStatus.OK);
             
                    }
                    
            
                     delete cart.id;
                     const updateddescuento = Object.assign(carritofound,cart);
                     await this.carritoRepository.save(updateddescuento);


                }
            }
        }

        return await this.carritoRepository.find({relations:['curso'],where:{id_user: user}}) 
 

  
}
    

 
 

    async delete(id: number){
        const productsFound = await this.carritoRepository.findOneBy({id:id})
      if (!productsFound ){
       throw new HttpException("producto no encontrado",HttpStatus.NOT_FOUND);

 } 
      return this.carritoRepository.delete(id);
   
       }


 


        

       
      
}
