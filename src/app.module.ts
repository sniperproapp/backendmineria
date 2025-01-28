import { Module } from '@nestjs/common';
 
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { MailsModule } from './mails/mails.module';
import { ConfigModule } from '@nestjs/config';
import { VideoModule } from './video/video.module';
import { ZoomModule } from './ZOOM/zoom.module';
import { DataSourceConfig } from './config/data.source';
import { PagosModule } from './pagos/pagos.module';
import { MensajeModule } from './mensaje/mensaje.module';
import { CategoriesCursosModule } from './categoriesCursos/categoriesCursos.module';
import { CursosModule } from './cursos/Cursos.module';
import { SectionCursosModule } from './section/SectionCursos.module';
import { ClaseCursosModule } from './clase/ClaseCursos.module';
import { FileCursosModule } from './files/FileCursos.module';
import { cuponCursosModule } from './cupones/cuponCursos.module';
import { descuentoCursosModule } from './descuento/descuentoCursos.module';
import { CarritoModule } from './carrito_de_compras/Carrito.module';
import { CursostudentModule } from './studentcurso/Cursostudent.module';
import { saleModule } from './sale/sale.module';
import { SaledetailModule } from './saledetail/Saledetail.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaccion/transaction.module';
import { CurrencyModule } from './currecy/currency.module';
import { BscscanModule } from './bscscan/Bscscan.module';
import { ReceivingWalletModule } from './ReceivingWallet/wallet.module';
import { PaymentsModule } from './payments/payments.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentsService } from './payments/payments.service';
import { ReceivingWalletService } from './ReceivingWallet/ReceivingWallet.service';
import { RetirosModule } from './retiros/retiros.module';
 

@Module({
  imports: [ScheduleModule.forRoot(),ConfigModule.forRoot({envFilePath: `.env` ,isGlobal:true}), 
    TypeOrmModule.forRoot({  ...DataSourceConfig
    }),
    UsersModule,
    AuthModule,
    saleModule,
    SaledetailModule,
    ReviewsModule,
    RolesModule,
    VideoModule,
    ZoomModule,
    CategoriesModule, 
    CategoriesCursosModule,
    ProductsModule,
    MailsModule,
    PagosModule,
    MensajeModule,
    CursosModule,
    CarritoModule,
    CursostudentModule,
    SectionCursosModule,
    ClaseCursosModule,
    FileCursosModule,
    cuponCursosModule,
    descuentoCursosModule,
    WalletModule,
    TransactionModule,
    BscscanModule,
    CurrencyModule,
    ReceivingWalletModule,
    PaymentsModule,
    RetirosModule
   
    
  ],
  exports: [ConfigModule], 
  providers:[AppService,  ],controllers:[AppController]
})
export class AppModule {}
