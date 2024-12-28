import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './video.entity';
import { Repository } from 'typeorm';
 
import  storage = require( '../utils/cloud_storage');

@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(Video) private videoRepository:Repository<Video>
    
    ){}
   

    findAll(){
        return this.videoRepository.find();
    }
 

 
}
