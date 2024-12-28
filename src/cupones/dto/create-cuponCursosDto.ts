import { IsNotEmpty, IsString } from "class-validator";

export class CreatecuponCursosDto{
 
 
    @IsNotEmpty()
    @IsString()
    code: string ;

    type_discount:number
    discount:number
    
    type_count:number
    num_use:number
    type_cupon:number

    courses:any[]
    categories:any[]
     
 


   
   
 
   

}