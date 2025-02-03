import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { ArrayContains, In, IsNull, Not, Repository } from 'typeorm';
import { RegisterauthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare } from 'bcrypt';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/roles/rol.entity';
import { MailsService } from 'src/mails/mails.service';
import  PUSH = require('../utils/firebase_message') ;
import { LoginidAuthDto } from './dto/loginid-auth.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import  storage = require( '../utils/cloud_storage');
import { Cursostudent } from 'src/studentcurso/Cursostudent.entity';
import { Cursos } from 'src/cursos/Cursos.entity';
import { Sale } from 'src/sale/sale.entity';
import { Saledetail } from 'src/saledetail/saledetail.entity';
import { Cursoauthresouce } from './dto/Cursoauthresouce.dto';
import { Reviews } from 'src/reviews/reviews.entity';
import { Wallet } from 'src/wallet/wallet.entity';
import { Retiros } from 'src/retiros/Retiros.entity';
 

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
export class AuthService {
     
    constructor(
         @InjectRepository(User) private usersRepository: Repository<User>,
         @InjectRepository(Wallet) private walletsRepository: Repository<Wallet>,
         @InjectRepository(Saledetail) private saledetailsRepository: Repository<Saledetail>,
         @InjectRepository(Reviews) private reviewssRepository: Repository<Reviews>,
         @InjectRepository(Cursostudent) private cursostudentsRepository: Repository<Cursostudent>,
         @InjectRepository(Cursos) private cursossRepository: Repository<Cursos>,
         @InjectRepository(Retiros) private retirosRepository: Repository<Retiros>,
    @InjectRepository(Rol) private rolesRepository:Repository<Rol>
    , private jwtservice: JwtService,private mailservices: MailsService){

    }

    async register(user: RegisterauthDto)
    {
        const {email,phone} = user;
        const emailexist= await this.usersRepository.findOneBy({email:email})
        if(emailexist){
            //409
            throw new HttpException('el email ya existe',HttpStatus.FORBIDDEN);
        }

        // const phoneexist= await this.usersRepository.findOneBy({phone:phone})
        // if(phoneexist){
        //     //409
        //     throw new HttpException('el telefono ya existe',HttpStatus.CONFLICT);
        // }
        user.descargo=0;
        user.time_limit= new Date();
        
        const newUser= await this.usersRepository.create(user);
        const wallet= await this.walletsRepository.create({id:user.id_wallet.toLowerCase(),balance:0,balance_ganancia:0,balance_minando:0})
         await this.walletsRepository.save(wallet);
        let rolesIds = [];
        if(user.rolesIds !== undefined && user.rolesIds!==null)
        {
            rolesIds=user.rolesIds;
        }else{
            rolesIds.push('CLIENT');
        }
         
        const roles =await this.rolesRepository.findBy({id: In(rolesIds)});
        newUser.roles= roles;
        newUser.wallet=wallet
        const usersave= await this.usersRepository.save(newUser);
        const rolesstring =usersave.roles.map(rol=> rol.id)
        const payload={
            id:usersave.id,
            name:usersave.name,
            roles:rolesstring};
        const token = this.jwtservice.sign(payload);
        const data= {
         user:usersave,
         token:'Bearer ' + token
      }
     
      delete data.user.password;
      return data
      
    }




//register admin de metronic
    async register_admin(file: Express.Multer.File, user: RegisterauthDto)
    {

      
        const {email,phone} = user;
        const emailexist= await this.usersRepository.findOneBy({email:email})
        if(emailexist){
            //409
            throw new HttpException('el email ya existe',HttpStatus.FORBIDDEN);
        }

        // const phoneexist= await this.usersRepository.findOneBy({phone:phone})
        // if(phoneexist){
        //     //409
        //     throw new HttpException('el telefono ya existe',HttpStatus.CONFLICT);
        // }
        user.descargo=0;
        user.time_limit= new Date();
        const url =await storage(file,file.originalname);
       
        if(url ===undefined && url === null)
        {
          throw new HttpException('La imagen no se pudo guardar ',HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const newUser=this.usersRepository.create(user);
        let rolesIds = [];
        if(user.rol =='1' )
        {
            rolesIds.push('CLIENT');
            rolesIds.push('ADMIN');
        }else{
            rolesIds.push('CLIENT');
            rolesIds.push('PROF');
        }
         
        const roles =await this.rolesRepository.findBy({id: In(rolesIds)});
        newUser.roles= roles;
        newUser.imagen=url;
        const usersave= await this.usersRepository.save(newUser);
         
         
        
     
        delete usersave.password;
      return usersave
      
    }


      getRandomArbitrary(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
      }
    


      async pasarg(id: string)
    {
        const walletfound= await this.walletsRepository.findOneBy({id: id});
        if (!walletfound)
            {
                throw new HttpException('walle no encontrada',HttpStatus.OK);
            }
        
            walletfound.balance=walletfound.balance*1+walletfound.balance_ganancia*1
            walletfound.balance_ganancia=0;
            const isok= await this.walletsRepository.save(walletfound);
        
         


        throw new HttpException('SALDO TRANSFERIDO',HttpStatus.OK);
     }



    async recuperarpass(email: string)
    {
        const userfound= await this.usersRepository.findOneBy({email: email});
        if (!userfound)
            {
                throw new HttpException('USUARIO NO ENCONTRADO',HttpStatus.OK);
            }
        const  valor= this.getRandomArbitrary(10000, 10000000);
        userfound.tokenpass=String(valor);
        const isok= await this.usersRepository.save(userfound);
        
        this.mailservices.senUserConfirmation(email,String(valor) );


        throw new HttpException('CORREO ENVIADO',HttpStatus.OK);
     }


     async updatepass(logindata: LoginAuthDto){
        const userfound= await this.usersRepository.findOneBy({tokenpass: logindata.tokenpass});
        
        if (!userfound)
        {
            throw new HttpException('token expiro',HttpStatus.OK);
        }
 
        userfound.password= await bcrypt.hash(logindata.password,10 );
        userfound.tokenpass='';
       const isok= this.usersRepository.save(userfound);

       throw new HttpException('MODIFICADO CON EXITO',HttpStatus.OK);

    }

    async login(logindata: LoginAuthDto)
    { 
         
        
        const {email,password}= logindata;
        const userFound= await this.usersRepository.findOne({
            where:{ email: email},
            relations:['roles','wallet']
            })

    
     
     if(!userFound)
      {
            throw new HttpException('EL EMAIL NO EXISTE',HttpStatus.NOT_FOUND);
       }



       if(userFound.estado==0)
       {
             throw new HttpException('Comuníquese con Administración para ser Activado',HttpStatus.FORBIDDEN);
        } 
   
        // if(userFound.duplicatesesion==1)
        // {
        //       throw new HttpException('Usuario tiene una sesion activa',HttpStatus.FORBIDDEN);
        //  } 
 
     
   const isPasswordValid = await compare(password,userFound.password)
   if(!isPasswordValid)
   {
    throw new HttpException('passwoed incorrecto',HttpStatus.FORBIDDEN);

       }
   

       if(userFound.notification_token!=logindata.token)
       {userFound.notification_token=logindata.token;}


   this.mailservices.welcome(email );

    const rolesIds = userFound.roles.map(rol=>rol.id) ;
   // userFound.duplicatesesion=1;
    this.usersRepository.save(userFound);
   const payload={
    id:userFound.id
    ,name:userFound.name,
    roles: rolesIds
};
   const token = this.jwtservice.sign(payload);
   const data= {
    user:userFound,
    token:'Bearer ' + token
 }

 delete data.user.password;
   return data;
    }




     
    async login_admin(logindata: LoginAuthDto){ 
        
    const {email,password}= logindata;
    const userFound= await this.usersRepository.findOne({
        where:{ email: email},
        relations:['roles']
        })


 
 if(!userFound)
  {
        throw new HttpException('EL EMAIL NO EXISTE',HttpStatus.NOT_FOUND);
   }

   const rolesIdstest = userFound.roles.map(rol=>rol.id) ;
   
 
if(!rolesIdstest.find(x => x == 'ADMIN'))
    {
          throw new HttpException('Solo administrador pueden ingresar',HttpStatus.FORBIDDEN);
     }
   if(userFound.estado==0)
   {
         throw new HttpException('Comuníquese con Administración para ser Activado',HttpStatus.FORBIDDEN);
    } 

    // if(userFound.duplicatesesion==1)
    // {
    //       throw new HttpException('Usuario tiene una sesion activa',HttpStatus.FORBIDDEN);
    //  } 

 
const isPasswordValid = await compare(password,userFound.password)
if(!isPasswordValid)
{
throw new HttpException('passwoed incorrecto',HttpStatus.FORBIDDEN);

   }


   if(userFound.notification_token!=logindata.token)
   {userFound.notification_token=logindata.token;}


//this.mailservices.welcome(email );

const rolesIds = userFound.roles.map(rol=>rol.id) ;
//userFound.duplicatesesion=1;
this.usersRepository.save(userFound);
const payload={
id:userFound.id
,name:userFound.name,
roles: rolesIds
};
const token = this.jwtservice.sign(payload);
const data= {
user:userFound,
token:'Bearer ' + token
}

delete data.user.password;
return data;
}

    async loginid(logindata: LoginidAuthDto)
    { 
         
        
        const {id}= logindata;
        const userFound= await this.usersRepository.findOne({
            where:{ id: id},
            relations:['roles']
            })

    
     
     if(!userFound)
      {
            throw new HttpException('EL EMAIL NO EXISTE',HttpStatus.NOT_FOUND);
       }

  

    const rolesIds = userFound.roles.map(rol=>rol.id) ;
    
    
   
   const token = logindata.token;

   const data= {
    user:userFound,
    token:  token}
   return data;
    }



    async logout(email: string)
    { 
         
        const userFound= await this.usersRepository.findOne({
            where:{ email: email},
            relations:['roles']
            })

     
     
     if(!userFound)
      {
            throw new HttpException('EL EMAIL NO EXISTE',HttpStatus.NOT_FOUND);
       }


 
        // if(userFound.duplicatesesion==1)
        // {
        //     userFound.duplicatesesion=0;
        //     this.usersRepository.save(userFound);
        //  } 
         
   return true;
    }




    async informacionuser(iduser:number)
    { 
        try {
          
            let user = iduser
             
             

            let Student = await this.usersRepository.findOne({where:{id: user},relations:['wallet','retiro']});
            let retirosporpagar = await this.retirosRepository.find({where:{status:0},relations:['user.wallet']});
            let retirospagados = await this.retirosRepository.find({where:{status:1},relations:['user.wallet']});

           
           
        return{
                enrolled_course_count: retirosporpagar,
                actived_course_count: retirospagados,
                termined_course_count:'',
                profile: {
                    id: Student.id,
                    name: Student.name,
                    surname: Student.lastname,
                    email: Student.email,
                    saldo: Student.saldo,
                    wallet: Student.wallet,
                    history: Student.retiro,
                   // birthday: Student.birthday ? formDateToYMD(new Date(Student.birthday)) : null,
                   // birthday_format: Student.birthday ? Student.birthday : null,
                    avatar: Student.imagen 
                },
                enrolled_course_news: '',
                actived_course_news: '',
                termined_course_news: '',
                sales: '',
                sales_details: '',
            }
        } catch (error) {
            console.log(error);
            throw new HttpException('HUBO UN ERROR',HttpStatus.NOT_FOUND);
           
        }
    }
         
         


}

function dosDecimales(n) {
    let t=n.toString();
    let regex=/(\d*.\d{0,4})/;
    return t.match(regex)[0];
  }

 
