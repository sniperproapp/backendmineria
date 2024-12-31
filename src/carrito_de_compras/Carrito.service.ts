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
import { MailsService } from 'src/mails/mails.service';
import { PagosService } from 'src/pagos/services/pagos.service';
import { use } from 'passport';
import { Client } from 'src/Client';
import { facturapagosDto } from './dto/facturapagos.dto';
 
  
@Injectable()
export class CarritoService {



constructor (@InjectRepository(Carrito) private carritoRepository: Repository<Carrito>,@InjectRepository(User) private usersRepository: Repository<User>,
 @InjectRepository(CategoryCursos) private categorycarritoRepository: Repository<CategoryCursos>,
 @InjectRepository(SectionCursos) private seccioncarritoRepository: Repository<SectionCursos>,
 @InjectRepository(CuponCursos) private cuponcarritoRepository: Repository<CuponCursos>,
 private mailservices: MailsService, private clientesilo: Client,private pagosservices:PagosService){}







 
  
 

    async findAll( iduser:number){
    
    return this.carritoRepository.find({relations:['curso'], where:{id_user:iduser},order: {
        id: "DESC" // "DESC"
    }})          
}



async getstatuspay( id:string){
    this.clientesilo.setSecretKey('hlTodcgOPkKEs2SjlYbNPbJpyg_QxCNEMiuoqKy4SkuEaWDsC4CAaJob9-00x-Lz');
    //let infopago = await this.pagosservices.getinfo(id);
    let infopago :any;
      infopago = await this.clientesilo.gettransid(id);
     console.log(infopago)
       
    if(!infopago)
        {
            throw new HttpException('no se encontro su orden de pago verifique el numero de orden enviado al correo',HttpStatus.OK); 
         }

    console.log(infopago.status)
 
    
    
  
   if(infopago.status =="PAID")
    {
         //falta transacsiones 
        const carrito= await this.carritoRepository.findOne({where:{id_transaccion:id }})
        let user=await this.usersRepository.findOne({where:{id:carrito.id_user}})
        user.saldo=carrito.monto;
        let useredit= await this.usersRepository.save(user);
        this.carritoRepository.delete(id);
        throw new HttpException('Su pago fue realizado correctamente su saldo se vera reflejado en momentos ',HttpStatus.OK); 
        
    }
    if(infopago.status=="PENDING")
        {
            throw new HttpException('Su pago esta pendiente de parte de la plataforma de pagos',HttpStatus.OK); 
        }
     if(infopago.status=="new")
            {
                throw new HttpException('Su pago fue creado correctamente debe ir a su correo a pagar con el link de pago',HttpStatus.OK); 
            }
    if(infopago.status!="PAID" && infopago.status!="new" && infopago.status!="PENDING")
    {
        const carrito= await this.carritoRepository.findOne({where:{id_transaccion:id }})
        this.carritoRepository.delete(carrito.id); 
        throw new HttpException('debe iniciar un nuevo pago',HttpStatus.OK); 
    }
    
    return

}
 
   


async create(carrito:CreateCarritoDto,idUser:number ){   
    
   
  const categorifound= await this.carritoRepository.findOne({where:{id_user:idUser, }})
  if(categorifound){
     throw new HttpException('el curso ya se encuentra registrado ',HttpStatus.OK);

    }
  carrito.id_user=idUser;
   let newcarrito = this.carritoRepository.create( carrito);
   

   const newcarritores= await this.carritoRepository.save(newcarrito);

   const newcarritoresr= await this.carritoRepository.findOne({relations:['curso'],where:{id:newcarritores.id}})
   
   
  return newcarritoresr
      
      
       

      
       
    
        
        
      
       
   
          
   }





   
async createmensualidad(carrito:CreateCarritoDto,idUser:number ){   
    let respuestafactura:any
    let user=await this.usersRepository.findOne({where:{id:idUser }})
    
    const categorifound= await this.carritoRepository.findOne({where:{id_user:idUser }})
    if(categorifound){
       throw new HttpException('el pago ya se encuentra registrado ',HttpStatus.OK);
  
      }
   
      carrito.id_user=idUser;
       
      let newcarrito = await this.carritoRepository.create( carrito);
      this.clientesilo.setSecretKey('hlTodcgOPkKEs2SjlYbNPbJpyg_QxCNEMiuoqKy4SkuEaWDsC4CAaJob9-00x-Lz');
      let resulqueriinvoice= await this.clientesilo.buildQuery("invoices/new",{order_number:65,currency:'USDT',source_currency:'USD',source_amount:carrito.monto,callback_url:'http://blockzonx.com',order_name:'cargar',email:user.email},true);
      respuestafactura= await this.clientesilo.crearinvoice(resulqueriinvoice);
   
     
      console.log(respuestafactura)
    
      newcarrito.id_transaccion=respuestafactura.txn_id;
 //throw new HttpException('el curso ya se encuentra registrado ',HttpStatus.OK);
     const newcarritores= await this.carritoRepository.save(newcarrito);




     let data={merchantTradeNo:newcarritores.id+"",orderAmountnumber:carrito.monto}
    // let infopagos = await this.pagosservices.create(data)//pagos por binance
 
     //console.log(infopagos)

     
     let orden={total:respuestafactura.invoice_total_sum,id:newcarritores.id,name:user.name,lastname:user.lastname,method_payment:"CRYPTO",link:respuestafactura.invoice_url,

     }
      this.mailservices.sendmaillinkdepago(orden,user.email)
     const newcarritoresr= await this.carritoRepository.findOne({where:{id:newcarritores.id}})
     
    return newcarritoresr
        
        
         
  
        
         
      
          
          
        
         
     
            
     }
  

 
    
    

 
 

    async delete(id: number){
        const productsFound = await this.carritoRepository.findOneBy({id:id})
      if (!productsFound ){
       throw new HttpException("producto no encontrado",HttpStatus.NOT_FOUND);

 } 
      return this.carritoRepository.delete(id);
   
       }


 


        

       
      
}
