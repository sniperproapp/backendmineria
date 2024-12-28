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
         @InjectRepository(Sale) private salesRepository: Repository<Sale>,
         @InjectRepository(Saledetail) private saledetailsRepository: Repository<Saledetail>,
         @InjectRepository(Reviews) private reviewssRepository: Repository<Reviews>,
         @InjectRepository(Cursostudent) private cursostudentsRepository: Repository<Cursostudent>,
         @InjectRepository(Cursos) private cursossRepository: Repository<Cursos>,
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
         
        const newUser=this.usersRepository.create(user);
        let rolesIds = [];
        if(user.rolesIds !== undefined && user.rolesIds!==null)
        {
            rolesIds=user.rolesIds;
        }else{
            rolesIds.push('CLIENT');
        }
         
        const roles =await this.rolesRepository.findBy({id: In(rolesIds)});
        newUser.roles= roles;
      
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


     
    
    async recuperarpass(email: string)
    {
        this.mailservices.senUserConfirmation(email );


        return true
     }


     async updatepass(logindata: LoginAuthDto){
        const userfound= await this.usersRepository.findOneBy({email: logindata.email});

        if (!userfound)
        {
            throw new HttpException('usuario no existe',HttpStatus.NOT_FOUND);
        }
 
        userfound.password= await bcrypt.hash(logindata.password,10 );
       const isok= this.usersRepository.save(userfound);

       if(isok!=null) { return true }else{return true}

    }

    async login(logindata: LoginAuthDto)
    { 
         
        
        const {email,password}= logindata;
        const userFound= await this.usersRepository.findOne({
            where:{ email: email},
            relations:['roles']
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
    userFound.duplicatesesion=1;
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
userFound.duplicatesesion=1;
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


 
        if(userFound.duplicatesesion==1)
        {
            userFound.duplicatesesion=0;
            this.usersRepository.save(userFound);
         } 
         
   return true;
    }




    async informacionuser(iduser:number)
    { 
        try {
          
            let user = iduser
            let enrolled_course_count = await this.cursostudentsRepository.count({where:{id_user: user}});
            // TODOS LOS CURSOS QUE AL MENOS SE HA VISTO UNA CLASE
            let actived_course_count = await this.cursostudentsRepository.count({where:{id_user: user,state: 1,clases_checked:Not(IsNull())}});
            let termined_course_count = await this.cursostudentsRepository.count({where:{id_user: user,state: 2}});
             

            let Student = await this.usersRepository.findOne({where:{id: user}});

            let enrolled_course_news = [];
            let actived_course_news = [];
            let termined_course_news = [];

            let enrolled_courses = await this.cursostudentsRepository.find({where:{id_user: user}});

            for (const enrolled_course of enrolled_courses) {
                let course = await this.cursossRepository.findOne({relations:['user','categorycurso','seciones.clases.files'],where:{id: enrolled_course.id_curso}});

                
                let numeroclase=0; 
                course.seciones.forEach((secione) => {
                   numeroclase+= secione.clases.length
                 })
                let N_CLASES =numeroclase;
                let curso:Cursoauthresouce
                const cursoresp= Object.assign(course, curso);
                cursoresp.n_clases=N_CLASES
                

                enrolled_course_news.push({
                    clases_checked: enrolled_course.clases_checked,
                    percentage: (((enrolled_course.clases_checked==null?1:enrolled_course.clases_checked.length)/N_CLASES)*100).toFixed(2),// 2/10 => 0.2 * 100 => 20
                    course: cursoresp,
                });
            }

            let actived_courses = await this.cursostudentsRepository.find({where:{id_user: user,state: 1,clases_checked:Not(IsNull())}});

            for (const actived_course of actived_courses) {
                let course = await this.cursossRepository.findOne({relations:['user','categorycurso','seciones.clases.files'],where:{id: actived_course.id_curso}});

                let numeroclase=0; 
                course.seciones.forEach((secione) => {
                   numeroclase+= secione.clases.length
                 })
                let N_CLASES =numeroclase;

              let curso:Cursoauthresouce
              const cursoresp= Object.assign( course, curso);
              cursoresp.n_clases=N_CLASES
                actived_course_news.push({
                    clases_checked: actived_course.clases_checked,
                    percentage: (((actived_course.clases_checked==null?1:actived_course.clases_checked.length) /N_CLASES)*100).toFixed(2),// 2/10 => 0.2 * 100 => 20
                    course: cursoresp,
                });
            }

            let termined_courses = await this.cursostudentsRepository.find({where:{id_user: user,state: 2}});

            for (const termined_course of termined_courses) {
                let course = await this.cursossRepository.findOne({relations:['user','categorycurso','seciones.clases.files'],where:{id: termined_course.id_curso}});
              
                let numeroclase=0; 
                course.seciones.forEach((secione) => {
                   numeroclase+= secione.clases.length
                 })
                let N_CLASES =numeroclase;
                let curso:Cursoauthresouce
                const cursoresp= Object.assign(course, curso);
                cursoresp.n_clases=N_CLASES
                termined_course_news.push({
                    clases_checked: termined_course.clases_checked,
                    percentage: (((termined_course.clases_checked==null?1:termined_course.clases_checked.length)/N_CLASES)*100).toFixed(2),// 2/10 => 0.2 * 100 => 20
                    course: cursoresp,
                });
            }

            let sales = await this.salesRepository.find({where:{id_user: user}});
            let sales_collection = [];
            let sales_details_collection = [];
            for (let sale of sales) {
                
                let sale_details = await this.saledetailsRepository.find({relations:['cursos.categorycurso'], where:{id_sale: sale.id}}) 
               
                // TAMBIEN NECESITAMOS ITERAR EL SALE DETAIL
                let sales_detail_collection = [];
                for (let sale_detail of sale_details) {
                    
                    sales_detail_collection.push({
                        course: {
                            id: sale_detail.cursos.id,
                            title: sale_detail.cursos.title,
                            imagen: sale_detail.cursos.imagen,
                            categorie: sale_detail.cursos.categorycurso,
                        },
                        type_discount: sale_detail.type_discount,
                        discount: sale_detail.discount,
                        campaign_discount: sale_detail.campaign_discount,
                        code_cupon: sale_detail.code_cupon,
                        code_discount: sale_detail.code_discount,
                        price_unit: sale_detail.price_unit,
                        subtotal: sale_detail.subtotal,
                        total: sale_detail.total,
                    });
                    let review =  await this.reviewssRepository.findOne({where:{id_saledetail: sale_detail.id}});
                    sales_details_collection.push({
                        course: {
                            id: sale_detail.cursos.id,
                            title: sale_detail.cursos.title,
                            imagen: sale_detail.cursos.imagen,
                            categorie: sale_detail.cursos.categorycurso,
                        },
                        type_discount: sale_detail.type_discount,
                        discount: sale_detail.discount,
                        campaign_discount: sale_detail.campaign_discount,
                        code_cupon: sale_detail.code_cupon,
                        code_discount: sale_detail.code_discount,
                        price_unit: sale_detail.price_unit,
                        subtotal: sale_detail.subtotal,
                        total: sale_detail.total,
                        id: sale_detail.id,
                        review: review,
                    });
                }
                sales_collection.push({
                    id: sale.id,
                    method_payment: sale.method_payment,
                    currency_total: sale.currency_total,
                    currency_payment: sale.currency_payment,
                    total: sale.total,
                    price_dolar: sale.price_dolar,
                    n_transaccion: sale.n_transaccion,
                    sales_details: sales_detail_collection,
                    created_at: formDateToYMD(sale.created_at),
                });
            }

            return{
                enrolled_course_count: enrolled_course_count,
                actived_course_count: actived_course_count,
                termined_course_count: termined_course_count,
                profile: {
                    id: Student.id,
                    name: Student.name,
                    surname: Student.lastname,
                    email: Student.email,
                   // profession: Student.profession,
                   // description: Student.description,
                    phone: Student.phone,
                   // birthday: Student.birthday ? formDateToYMD(new Date(Student.birthday)) : null,
                   // birthday_format: Student.birthday ? Student.birthday : null,
                    avatar: Student.imagen 
                },
                enrolled_course_news: enrolled_course_news,
                actived_course_news: actived_course_news,
                termined_course_news: termined_course_news,
                sales: sales_collection,
                sales_details: sales_details_collection,
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

 
