import { HttpException, HttpStatus, Inject, Injectable, Search } from '@nestjs/common';
import { ArrayContains, Like } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { Rol } from '../roles/rol.entity';
import  storage = require( '../utils/cloud_storage');
import { UpdateTimeLimitUserDto } from './dto/update_time_limit-user';
import { Wallet } from 'src/wallet/wallet.entity';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository:Repository<User>
        ,@InjectRepository(Rol) private RolesRepository:Repository<Rol>
        ,@InjectRepository(Wallet) private walletRepository:Repository<Wallet>
    ){}
    async create(user:CreateUserDto)
         
    {  
        
        user.id_wallet=user.id_wallet.toLowerCase()
        const newUser= await this.usersRepository.create(user);
      
       const wallet= await this.walletRepository.create({id:user.id_wallet.toLowerCase(),balance:0,balance_ganancia:0,balance_minando:0})
        this.walletRepository.save(wallet);
       return  this.usersRepository.save(newUser)
    }

    findAll(busqueda: string){
        if(busqueda=='allusers'){
            return this.usersRepository.find({relations:['roles'],order: {
                estado: {
                    direction: "ASC"
                }
            }});
        }
        else{
            return this.usersRepository.find({relations:['roles'],where:{email:Like('%'+busqueda+'%')}});
        }
        
    }



    
    async finduser(email: string){
        
        return   await   this.usersRepository.findOne({ where:{email:Like('%'+email+'%')}});
   
            
    }


    findAllinstructor( ){
       
             
   
        return this.usersRepository.find({ where: {
          roles:{id:"PROF"}
   },relations:['roles'],}  );
     
   

    }



    findAlladmin(busqueda: string){
       
            
       console.log(busqueda)
       if(busqueda!="alluserlist"){
        return this.usersRepository.find({relations:['roles'],where:[{email: Like('%'+busqueda+'%')  },{name: Like('%'+busqueda+'%')  },{lastname: Like('%'+busqueda+'%')  }]});
       }
            
       return this.usersRepository.find({relations:['roles']  });
         
        
    }

    findAlladminpro( ){
       
             
   
         return this.usersRepository.find({ where: {
           roles:{id:"PROF"}
    },relations:['roles'],}  );
      
             
       
          
         
     }


    async update(id: number, user: UpdateUserDto){
        const userfound= await this.usersRepository.findOneBy({id: id});

        if (!userfound)
        {
            throw new HttpException('usuario no existe',HttpStatus.NOT_FOUND);
        }
        console.log(user)

        const updatedUser = Object.assign(userfound,user);
        console.log(updatedUser)

        return this.usersRepository.save(updatedUser);

    }



    async activate(id: number, timelimit: UpdateTimeLimitUserDto){
       // console.log(timelimit.timelimit);
        const userfound= await this.usersRepository.findOneBy({id: id});

        if (!userfound)
        {
            throw new HttpException('usuario no existe',HttpStatus.NOT_FOUND);
        }
         userfound.estado=1;
        
          
        // userfound.time_limit=  new Date( timelimit.timelimit);
         this.usersRepository.save(userfound);
        return true;

    }

    async desactivateall(){
        let currentDate: Date = new Date();
        
        //console.log(currentDate.toLocaleString().split('/')[0]+currentDate.toLocaleString().split('/')[2].split(',')[0])
        const usersfound= await this.usersRepository.find({relations:['roles'],where:{estado:1}});
          
        if (!usersfound)
        {
            throw new HttpException('usuario no existe',HttpStatus.NOT_FOUND);
        }
        usersfound.forEach((element) => {
            //console.log(  element.time_limit.toLocaleString().split('/')[0]+ element.time_limit.toLocaleString().split('/')[2].split(',')[0])
           
            if(element.roles.length==1)
          {  
            // if(element.time_limit.toLocaleString().split('/')[2].split(',')[0]==currentDate.toLocaleString().split('/')[2].split(',')[0])
            // {
            //     if(Number(element.time_limit.toLocaleString().split('/')[0])<=Number(currentDate.toLocaleString().split('/')[0]))
            //         {
            //             element.estado=0;
                        
            //         }

            // }
           
            }
        })

        
         this.usersRepository.save(usersfound);
        return true;

    }



    async descargo(id: number){
        const userfound= await this.usersRepository.findOneBy({id: id});

        if (!userfound)
        {
            throw new HttpException('usuario no existe',HttpStatus.NOT_FOUND);
        }
         //userfound.descargo=1;
         this.usersRepository.save(userfound);
        return true;

    }
    async inactivate(id: number){
        const userfound= await this.usersRepository.findOneBy({id: id});

        if (!userfound)
        {
            throw new HttpException('usuario no existe',HttpStatus.NOT_FOUND);
        }
        userfound.estado=0;
        this.usersRepository.save(userfound);
        return true;

    }



    async updateWithImage(file: Express.Multer.File,id: number, user: UpdateUserDto){

       const url =await storage(file,file.originalname);
       
  if(url ===undefined && url === null)
  {
    throw new HttpException('La imagen no se pudo guardar ',HttpStatus.INTERNAL_SERVER_ERROR);
  }
  const userfound= await this.usersRepository.findOneBy({id: id});
       if (!userfound)
       {
        throw new HttpException('usuario no existe',HttpStatus.NOT_FOUND);
       }
       user.imagen=url;
       console.log('user.password')
       console.log(user.password)
       console.log('user.password')
       
       const updatedUser = Object.assign(userfound,user);
       return this.usersRepository.save(updatedUser);
       
    }
}
