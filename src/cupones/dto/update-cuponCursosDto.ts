import { IsNotEmpty, IsString } from "class-validator";

export class updatecuponCursosDto{
 
 
 
    id?: number ;
  
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