import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
 
import  storage = require( '../utils/cloud_storage');
import { InjectRepository } from '@nestjs/typeorm';
import {   Repository } from 'typeorm';
 
import { User } from 'src/users/user.entity';
import { Vimeo } from '@vimeo/vimeo';
import getVideoDurationInSeconds from 'get-video-duration';
import { updateclaseCursosDto } from './dto/update-claseCursosDto';
import { CreateClaseCursosDto } from './dto/create-ClaseCursosDto';
import { ClaseCursos    } from './ClaseCursos.entity';
import { CreateclasevideoDto } from './dto/Create-Clase-video.dto';
import { ConfigService } from '@nestjs/config';
 
 
const configService = new ConfigService();

const fs=require('fs')
let client = new Vimeo(configService.get('CLIENT_IDENTIFIER') , configService.get('CLIENT_SECRET'),configService.get('SECRE_KEY_VIMEO'));
 

@Injectable()
export class ClaseCursosService {
    constructor(
        @InjectRepository(ClaseCursos) private ClaseRepository: Repository<ClaseCursos>,@InjectRepository(User) private usersRepository: Repository<User>
    ){}

    async findAll(id:number){
      let listarespuesta: Array< any> =[]
      
      console.log(id)
      const data= await this.ClaseRepository.find({relations:['files'], where:{id_sectionCursos:id} });
      data.forEach((element) => {
        let listatiempo: Array< any> =[]
        listatiempo.push(element.time)

        element.time= this.sumarTiempos(...listatiempo);
        listarespuesta.push(element)
    });
        return listarespuesta
    }
    
      
       
     
       
    

   

    async create(  clase:CreateClaseCursosDto){

      const categorifound= await this.ClaseRepository.findOneBy({title:clase.title})
      // if(categorifound){
      //  throw new HttpException('la seccion ya se encuentra registrada ',HttpStatus.OK);

      // }
       let newclase = this.ClaseRepository.create( clase);
 
     
      
       
      return this.ClaseRepository.save(newclase);
    }


     




     async update( id: number,section:updateclaseCursosDto){
        
      
     

        const categorifound= await this.ClaseRepository.findOneBy({id: id})
        if(!categorifound){
         throw new HttpException('la categoria no se encuentra ',HttpStatus.OK);
 
        }
         console.log(section);
         console.log(categorifound
          
         );

         categorifound.title=section.title;
         categorifound.estado=section.estado;
         categorifound.description=section.description;
        return this.ClaseRepository.save(categorifound);
      }

      async delete(id: number){

        const categorifound = await this.ClaseRepository.findOneBy({id: id})
        if(!categorifound){
            throw new HttpException('la categoria no se encuentra ',HttpStatus.NOT_FOUND);
    
           }
       
        return this.ClaseRepository.delete(id);

    }



    
async uploadvideovimeo(file: Express.Multer.File,curso: CreateclasevideoDto): Promise<any>
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
            fs.unlinkSync(file.path)//eliminar el video del servidor
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

   

async uploadvideo(file: Express.Multer.File,curso: CreateclasevideoDto):Promise<any>
{
    let DURATION;
    const claseFound = await this.ClaseRepository.findOneBy({id:curso.id})
       
    

    
     getVideoDurationInSeconds(file.path).then((duration) => {
        console.log(this.formatarDuracion(duration))
       DURATION= this.formatarDuracion(duration)
        
     })
   
     const resul= await this.uploadvideovimeo(file,curso);
    
     //const tiempoTotal = this.sumarTiempos(...registros);
     
     
    claseFound.vimeo_id="https://player.vimeo.com/video/"+resul.split('/')[2];
    claseFound.time=DURATION;
    let savecurso= this.ClaseRepository.save(claseFound); 
   // 
   return await savecurso;    

}


  formatarDuracion(durationInSeconds) {
     
      const hours = Math.floor(durationInSeconds / 3600);
      const minutes = Math.floor((durationInSeconds % 3600) / 60);
      const seconds = Math.floor(durationInSeconds % 60);
    
      const formattedHours = String(hours).padStart(2, '0');
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(seconds).padStart(2, '0');
    
      return(  `${formattedHours}:${formattedMinutes}:${formattedSeconds}`);

 
 
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

}
