import { Double } from "typeorm";

export class UpdateProductsDto{
  

    name?: string;
    description?: string;
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
    tpactivate1?: boolean;
    tpactivate2?: boolean;
    tpactivate3?: boolean;
    tpactivate4?: boolean;
    tpactivate5?: boolean;
    
    id_category?: number;
    id_user?: number;
    image1?: string;
    image2?: string;
    image_To_update?: string;
    estad?: string;
    like?:number;
} 