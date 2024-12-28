import { IsNotEmpty, IsString } from "class-validator";

export class CreatepagosDto{
 
  
  merchantId : number
        merchantTradeNo: number
        tradeType: string
        totalFee: number
        currency: string
        productType: string
        productName: string
        productDetail:string
 
   
   
 
   

}