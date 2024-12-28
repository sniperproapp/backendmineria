import { Injectable, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatepagosDto } from '../dto/createpagosDto';
const crypto = require('crypto');
const axios = require('axios');
// This is a very simple script working on Binance Pay API
// Set your apiKey and apiSecret, then you are ready to go.
const configService = new ConfigService();
const apiKey = configService.get('KEY_BINANCE') // set your API key here 
const apiSecret =configService.get('SECRE_KEY_BINANCE')// set your secret key here
const baseURL = 'https://bpay.binanceapi.com'
 
 
function hash_signature(query_string) {
    return crypto
        .createHmac('sha512', apiSecret)
        .update(query_string)
        .digest('hex');
  }


  
// ===== functions ======

function random_string() {
    return crypto.randomBytes(32).toString('hex').substring(0,32);
  }
  
  function dispatch_request(http_method, path, payload = {}) {
      const timestamp = Date.now()
      const nonce = random_string()
      const payload_to_sign = timestamp + "\n" + nonce + "\n" + JSON.stringify(payload) + "\n"
      const url = baseURL + path
      const signature = hash_signature(payload_to_sign)
      return axios.create({
        baseURL,
        headers: {
          'content-type': 'application/json',
          'BinancePay-Timestamp': timestamp,
          'BinancePay-Nonce': nonce,
          'BinancePay-Certificate-SN': apiKey,
          'BinancePay-Signature': signature.toUpperCase()
        }
      }).request({
        'method': http_method,
        url,
        data: payload
      })
  }
  
  // ===== functions ======
  
  
  // Query Order
   
  // POST /binancepay/openapi/order/query
  // https://developers.binance.com/docs/binance-pay/api-order-query
  function query_order() {
    dispatch_request(
      'POST', 
      '/binancepay/openapi/v2/order/query', 
      {
        "merchantTradeNo": "222222",
      }
    ).then(response => console.log(response.data) ).catch(error => console.log(error))
   
  }
  
 
  
  
  // Create Order
  //
  // POST /binancepay/openapi/order
  // https://developers.binance.com/docs/binance-pay/api-order-create
  function create_order(pago:CreatepagosDto) {
    dispatch_request(
      'POST', 
      '/binancepay/openapi/v3/order',
      {
        "env": {
          "terminalType": "WEB"
        },
         
        "merchantTradeNo": "222222",
        "orderAmount": 25.17,
        "currency": "USDT",
        "description": "very good Ice Cream",
        "goodsDetails": [{
          "goodsType": "01",
          "goodsCategory": "D000",
          "referenceGoodsId": "7876763A3B",
          "goodsName": "Ice Cream",
          "goodsDetail": "Greentea ice cream cone"
        }]
      }
    ).then(response => console.log(response.data)).catch(error => console.log(error))
  }
   // 'merchantId': pago.merchantId,
        // 'merchantTradeNo':pago.merchantTradeNo,
        // 'tradeType': pago.tradeType,
        // 'totalFee': pago.totalFee,
        // 'currency': pago.currency,
        // 'productType':pago.productType,
        // 'productName': pago.productName,
        // 'productDetail': pago.productDetail
  //create_order()
   
@Injectable()
export class PagosService {


    async getHello(): Promise<any> {

   var res =await query_order();
        

       return res
      }



      async create(pago:CreatepagosDto): Promise<any> {
console.log(pago)
        var res =await create_order(pago);
        return res
      
     
      
     
     
          
     
     }









 
}
