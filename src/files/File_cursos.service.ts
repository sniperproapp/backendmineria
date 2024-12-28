import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
 
import  storagefiles = require( '../utils/cloud_storage_files');
import  storagefilesdelete = require( '../utils/cloud_storage_files_delete');
import { InjectRepository } from '@nestjs/typeorm';
import {   Repository } from 'typeorm';
 
import { User } from 'src/users/user.entity';
import { Vimeo } from '@vimeo/vimeo';
import getVideoDurationInSeconds from 'get-video-duration';
import { updateclaseCursosDto } from './dto/update-claseCursosDto';
import { CreateClaseCursosDto } from './dto/create-ClaseCursosDto';
import {    FileCursos    } from './FileCursos.entity';
import {    CreatefilevideoDto } from './dto/Create-file-video.dto';
import { ok } from 'assert';
import cloud_storage_files_delete = require('../utils/cloud_storage_files_delete');


const fs=require('fs')
let client = new Vimeo("9de59c71c4509177f7a98b46f856a34a862065a6", "tZPFcw1Z2/z60i3kcP4jQt5fqUw4szgGG6P+7TZmOO4qLrEtuBwvfkQEsBe9qTZ5lsCtqZXdyuzYxbAnQGZqXxRqVAJxt80fcwqiGsl3PrAbQ/M/llXHYbcopHXIDwXV", "889f192e0d994122eee55e2a43a334d1");

@Injectable()
export class FileCursosService {
    constructor(
        @InjectRepository(FileCursos) private fileRepository: Repository<FileCursos>,@InjectRepository(User) private usersRepository: Repository<User>
    ){}

    async findAll(id:number){
      console.log(id)
        return this.fileRepository.find({where:{id_sectionCursosclasefile:id} });
    }
    
      
       
     
       
    

   

    async createuploadfile(file: Express.Multer.File,  info:CreatefilevideoDto){
      const url =await storagefiles(file,file.originalname);
       
      if(url ===undefined && url === null)
      {
        throw new HttpException('el archivo  no se pudo guardar ',HttpStatus.INTERNAL_SERVER_ERROR);
      }



       const filefound= await this.fileRepository.findOneBy({file:info.file_name})
      if(filefound){
         throw new HttpException('el archivo esta subido  ',HttpStatus.OK);

       }
       let newfile = this.fileRepository.create( info );
 
     
      newfile.file=url;
       
      return  this.fileRepository.save(newfile);
    }


     




     async update( id: number,section:updateclaseCursosDto){
        
      
     

        const categorifound= await this.fileRepository.findOneBy({id: id})
        if(!categorifound){
         throw new HttpException('la categoria no se encuentra ',HttpStatus.OK);
 
        }
         console.log(section);
         console.log(categorifound
          
         );

        //  categorifound.title=section.title;
        //  categorifound.estado=section.estado;
        //  categorifound.description=section.description;
        return this.fileRepository.save(categorifound);
      }

      async delete(id: number){

        const filefound = await this.fileRepository.findOneBy({id: id})
        if(!filefound){
            throw new HttpException('la filea no se encuentra ',HttpStatus.NOT_FOUND);
    
           }

          // await storagefilesdelete( filefound.file);
        return  this.fileRepository.delete(id);

    }



    
async uploadvideovimeo(file: Express.Multer.File,curso: CreatefilevideoDto): Promise<any>
{
    return new Promise((resolve,reject)=>{

        client.upload(    
            file.path,
          {
            'name': curso.id_sectionCursosclasefile,
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
