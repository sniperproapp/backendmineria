import { facturapagosDto } from "src/carrito_de_compras/dto/facturapagos.dto";
import { CurrenciesDto } from "./CurrencyDto";

export interface CryptocurrencyApiResponse {
  data: CurrenciesDto;
  status: string;
}

export interface CryptoinvoiceApiResponse {
  data: facturapagosDto;
  status: string;
}

export class CryptoinvoiceApiResponseDto implements CryptocurrencyApiResponse{
  public data!: CurrenciesDto;
  
  public status!: string;

}

export class CryptocurrencyApiResponseDto implements CryptocurrencyApiResponse{
  public data!: CurrenciesDto;
  public status!: string;

}