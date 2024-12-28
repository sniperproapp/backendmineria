import { IsNotEmpty, IsString } from "class-validator";

export class CategoryCursosResouceDto{
 
     
id: number

 
titulo: string;
 
 
estado: number;
count_curso: number;


image: string;

 
created_at: Date;

 
updated_at: Date;
titulosinespacio:string;


cursos:any[]
 

}