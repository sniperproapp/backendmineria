import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class facturapagosDto{
     

 
    txn_id: string
    invoice_url: string
    invoice_total_sum: number


}