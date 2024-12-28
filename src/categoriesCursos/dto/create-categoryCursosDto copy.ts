import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryCursosDto{
 
 
    @IsNotEmpty()
    @IsString()
    titulo: string ;


     
   
 
    image: string ;

}