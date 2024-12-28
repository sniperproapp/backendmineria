 
import { Cursos } from "src/cursos/Cursos.entity";
import { Sale } from "src/sale/sale.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'sale_detail'})
export class Saledetail{

    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    type_discount:number;

    @Column()
    discount:number; 
    
    @Column()
    campaign_discount:number;


    @Column({nullable: true})
    code_cupon:string;

    @Column()
    code_discount:string;


    @Column()
    price_unit:number;
   
    @Column()
    subtotal:number;
   
    @Column()
    total:number;
  
    @Column()
    id_sale:number;

    @Column()
    id_curso:number;
    
     
    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    updated_at: Date;

    @ManyToOne(()=>Sale,(sale)=>sale.id)
    @JoinColumn(  {name: 'id_sale' })
    sale: Sale


    @ManyToOne(()=>Cursos,(curso)=>curso.id)
    @JoinColumn(  {name: 'id_curso' })
    cursos: Cursos


   


  
}