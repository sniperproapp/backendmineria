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
 

@Module({
  imports: [ConfigModule.forRoot({envFilePath: `.env` ,isGlobal:true}), 
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
   
    
  ],
  exports: [ConfigModule], 
})
export class AppModule {}
