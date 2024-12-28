import { Double } from "typeorm";

export class CreatecursoDto{


     


     
    title:string;

     
    slug:string;

   
    
    estado:number;
   
   
     
    subtitle:string;

     
    description:string;
   
     
    price_pesos: number;
   
     
    price_usd: number;
   
   
    imagen: string;
   
    vimeo_id: string;
   
    level: string;
   
    idioma: string;
   
    requirements: string;
   
    who_is_it_for: string;

 
     
    id_category_curso:number;
     
    id_user:number;
}