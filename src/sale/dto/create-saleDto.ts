import { IsNotEmpty, IsString } from "class-validator";

export class CreateSaleDto{
 
  method_payment:string
    currency_total: string
    currency_payment: string
    total:number
    @IsNotEmpty()
    @IsString()
    n_transaccion:string
    id_user:number


     
   
 
   

}