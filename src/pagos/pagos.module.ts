import { Module } from '@nestjs/common';
import { PagosService } from './services/pagos.service';
import { PagosController } from './controller/pagos.controller';

@Module({
  providers: [PagosService],
  controllers: [PagosController]
})
export class PagosModule {}
