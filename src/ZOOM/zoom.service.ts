import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Zoom } from './zoom.entity';
import { Repository } from 'typeorm';
 
import  storage = require( '../utils/cloud_storage');
import { updateZoomDto } from './dto/update-ZoomDto';

@Injectable()
export class ZoomService {
    constructor(
        @InjectRepository(Zoom) private zoomRepository:Repository<Zoom>
    
    ){}
   

    findAll(){
        return this.zoomRepository.find();
    }
 


    
    async update( id: number,zoom:updateZoomDto){
        
       
        const zoomfound= await this.zoomRepository.findOneBy({id: id})
        if(!zoomfound){
         throw new HttpException('la categoria no se encuentra ',HttpStatus.NOT_FOUND);
 
        }
         const updatezoom = Object.assign(zoomfound,zoom);
        return this.zoomRepository.save(updatezoom);
      }

      async updateWithImage(file: Express.Multer.File,id: number,zoom:updateZoomDto){
        
        const url = await  storage(file,file.originalname);
        if(url ===undefined && url === null)
        {
          throw new HttpException('La imagen no se pudo guardar ',HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const zoomfound= await this.zoomRepository.findOneBy({id: id})
        if(!zoomfound){
         throw new HttpException('la categoria no se encuentra ',HttpStatus.NOT_FOUND);
 
        }
        
       
       zoom.image=url;
       const updatezoom = Object.assign(zoomfound,zoom);
        return this.zoomRepository.save(updatezoom);
      }

 
}
 