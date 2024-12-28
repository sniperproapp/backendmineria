import { Body, Controller, Get, Post } from '@nestjs/common';
import { PagosService } from '../services/pagos.service';
import { CreatepagosDto } from '../dto/createpagosDto';

@Controller('pagos')
export class PagosController {
    constructor(private readonly pagosservices: PagosService) {}

    @Get('orden')
    getHello(): any {
      return this.pagosservices.getHello();
    }

 
@Post() 
createWithImage(   
 @Body()  pago :CreatepagosDto) {
 
   return this.pagosservices.create( pago);
}
}
