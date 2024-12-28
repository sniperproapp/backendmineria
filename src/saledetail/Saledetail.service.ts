import { HttpException, HttpStatus, Injectable   } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';  
import { User } from 'src/users/user.entity';  
import { Repository } from 'typeorm'; import { CategoryCursos } from 'src/categoriesCursos/categoryCursos.entity'; 
import { SectionCursos } from 'src/section/SectionCursos.entity';   
import { CuponCursos } from 'src/cupones/cuponCursos.entity';
import { Carrito } from 'src/carrito_de_compras/Carrito.entity';
import { CreateSaledetailDto } from './dto/Create-CreateSaledetailDto.dto';
import { Saledetail } from './saledetail.entity';
 
  
@Injectable()
export class SaledetailService {



constructor (@InjectRepository(Saledetail) private saledetailRepository: Repository<Saledetail>,@InjectRepository(User) private usersRepository: Repository<User>,
 
 @InjectRepository(CuponCursos) private cuponsaledetailRepository: Repository<CuponCursos>){}







 
  
 

    async findAll( iduser:number){
    
    return this.saledetailRepository.find({relations:['curso'], where:{id:iduser},order: {
        id: "DESC" // "DESC"
    }})          
}

 
   


async create(carrito:CreateSaledetailDto,idUser:number ){   
    
   
  const categorifound= await this.saledetailRepository.findOne({where:{id :idUser,id_sale:carrito.id_curso}})
  if(categorifound){
     throw new HttpException('el curso ya se encuentra registrado ',HttpStatus.OK);

    }
  carrito.id_user=idUser;
   let newcarrito = this.saledetailRepository.create( carrito);
   const newcarritores= await this.saledetailRepository.save(newcarrito);
   //const newcarritoresr= await this.saledetailRepository.findOne({relations:['curso'],where:{id:newcarritores.id}})
   
 // return newcarritoresr
      
      
       

      
       
    
        
        
      
       
   
          
   }


 
    async update( iduser: number,cupon:string){
  
        // PORQUE VA FUNCIONAR COMO APLICACION DE CUPON}
        let user = iduser
        let CUPON = await this.cuponsaledetailRepository.findOne({where:{code:cupon}});
        if(!CUPON){
          throw new HttpException('el cupon no se encuentra registrado ',HttpStatus.OK);
         
        }
        let carts = await this.saledetailRepository.find({relations:['curso'],where:{id : user}})
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
                if(courses.includes(cart.  id+"")){
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
                         carritofound= await this.saledetailRepository.findOneBy({id:cart.id})
                    if(!carritofound){
                     throw new HttpException('la carritoa no se encuentra ',HttpStatus.OK);
             
                    }
                    
            
                     delete cart.id;
                     const updateddescuento = Object.assign(carritofound,cart);
                     await this.saledetailRepository.save(updateddescuento);



                }
            }
            if(categories.length > 0){
                if(categories.includes(cart.  id+"")){
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
                       carritofound= await this.saledetailRepository.findOne({where:{id:cart.id}});
                    if(!carritofound){
                     throw new HttpException('la carritoa no se encuentra ',HttpStatus.OK);
             
                    }
                    
            
                     delete cart.id;
                     const updateddescuento = Object.assign(carritofound,cart);
                     await this.saledetailRepository.save(updateddescuento);


                }
            }
        }

        return await this.saledetailRepository.find({relations:['curso'],where:{id : user}}) 
 

  
}
    

 
 

    async delete(id: number){
        const productsFound = await this.saledetailRepository.findOneBy({id:id})
      if (!productsFound ){
       throw new HttpException("producto no encontrado",HttpStatus.NOT_FOUND);

 } 
      return this.saledetailRepository.delete(id);
   
       }


 


        

       
      
}
