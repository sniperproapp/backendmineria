import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PagosService } from '../services/pagos.service';
import { CreatepagosDto } from '../dto/createpagosDto';

@Controller('pagos')
export class PagosController {
    constructor(private readonly pagosservices: PagosService) {}

    @Get('orden')
    getHello( @Param('id') id: number): any {
      return this.pagosservices.getinfo(id);
    }

 
@Post('pagomensual') 
createWithImage(   
 @Body()  pago :CreatepagosDto) {
 
   return this.pagosservices.create( pago);
}




}
