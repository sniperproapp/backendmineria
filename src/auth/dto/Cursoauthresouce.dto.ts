import { Double } from "typeorm";

export class Cursoauthresouce{


     


     
    title:string;

     
    slug:string;

   
    
    estado:number;
   
   
     
    subtitle:string;

     
    description:string;
   
     
    price_pesos: number;
   
     
    price_usd: number;
    n_clases: number;
   
   
    imagen: string;
   
    vimeo_id: string;
   
    level: string;
   
    idioma: string;
   
    requirements: string;
   
    who_is_it_for: string;
    time_parse: string;

    seciones:any[]
    categorycurso:any;
    discount_g:any
    user:any;
    n_students :any
    num_review:any
    avg_rating :any
    cursostuden_have_course:any
}