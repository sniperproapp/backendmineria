import { IsNotEmpty, IsString } from "class-validator";

export class CreateSectionCursosDto{
 
 
    @IsNotEmpty()
    @IsString()
    title: string ;

    @IsNotEmpty()
    @IsString()
    id_curso:number;


     
   
 
   

}