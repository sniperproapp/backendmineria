import { IsNotEmpty, IsString } from "class-validator";

export class CreateClaseCursosDto{
 
 
    @IsNotEmpty()
    @IsString()
    title: string ;

    @IsNotEmpty()
    @IsString()
    description: string ;

    @IsNotEmpty()
    @IsString()
    id_sectionCursos:number;


   
   
 
   

}