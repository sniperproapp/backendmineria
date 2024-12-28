import { Double } from "typeorm";

export class CreateProductsDto{


    name: string;
    description: string;
    comp_venta?: string;
    price?: number;
    price1?: number;
    price2?: number;
    sl?: number;
    tp1?: number;
    tp2?: number;
    tp3?: number;
    tp4?: number;
    tp5?: number; 
     image1?: string;
     fecha:string;
    id_category: number;
    id_user: number;
    estad: string;
    like:number;
}