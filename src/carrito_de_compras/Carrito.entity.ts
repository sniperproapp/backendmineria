 
import { Cursos } from "src/cursos/Cursos.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'carrito'})
export class Carrito{

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
    id_user:number;
    @Column()
    id_curso:number;

    @Column()
    id_transaccion:number;
    
      
    
      
    
    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    updated_at: Date;

    @ManyToOne(()=>User,(user)=>user.id)
    @JoinColumn(  {name: 'id_user' })
    user: User


    @ManyToOne(()=>Cursos,(cursos)=>cursos.id)
    @JoinColumn(  {name: 'id_curso' })
    curso: Cursos



  
}