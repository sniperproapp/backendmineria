import axios, { AxiosResponse } from "axios";
import { CurrenciesDto, CurrencyDto } from "./types/CurrencyDto";
import { CryptocurrencyApiResponse } from "./types/CryptocurrencyApiResponseDto";
import { facturapagosDto } from "./carrito_de_compras/dto/facturapagos.dto";

export class Client {
  private secretKey?: string;
  private apiKeyName = "api_key";
  private apiEndPoint = "https://api.plisio.net/api/v1/";

  constructor(secretKey?: string) {
    this.setSecretKey(secretKey);
  }

  public setSecretKey(secretKey?: string) {
    this.secretKey = secretKey || undefined;
  }

  public async getCurrencies(): Promise<CurrencyDto[] | null> {
    try {
      const url = this.buildQuery("currencies");
      const resp: CryptocurrencyApiResponse = await axios.get<CryptocurrencyApiResponse>(url)
        .then(response => response.data);
      return resp.data.map(i => new CurrencyDto(i));
    } catch (e: any) {
      console.log(e);
      return null;
    }
  }

  public async getBalances(coin?: string): Promise<CurrencyDto[]|null> {
    const url = this.buildQuery("currencies");
    const resp = await this.apiCall<CryptocurrencyApiResponse>(url);
    return resp.data.map(i => new CurrencyDto(i));
  }


  public async crearinvoice(url: string): Promise<any[]|null> {
    const resp = await this.apiCall<any>(url);
    return resp.data  ;
  }

  public async gettransid(id: string): Promise<any[]|null> {
    const url = this.buildQuery("operations/"+id);
    console.log(url)
    const resp = await this.apiCall<any>(url);
    return resp.data  ;
  }

  public buildQuery(
    uri: string,
    parameters: any = {},
    addApiKey: boolean = true
  ): string {
    let url: string = this.apiEndPoint + uri;

    if (addApiKey && this.secretKey) {
      parameters[this.apiKeyName] = this.secretKey;
    }
    const query = new URLSearchParams(parameters);


    url += "?" + query.toString();

    return url;
  }


  private async apiCall<T>(url: string): Promise<T> {
    try {
      
      return await axios.get<T>(url).then(response => response.data);
    } catch (e: any) {
      return e;
    }
  }
}
