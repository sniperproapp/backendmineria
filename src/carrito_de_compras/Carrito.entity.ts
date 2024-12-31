 
import { Cursos } from "src/cursos/Cursos.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'carrito'})
export class Carrito{

    @PrimaryGeneratedColumn()
    id: number;
 
   
    @Column()
    monto:number;
  
    @Column()
    id_user:number;
     
    @Column()
    id_transaccion:string;
    
      
    
      
    
    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    updated_at: Date;

    @ManyToOne(()=>User,(user)=>user.id)
    @JoinColumn(  {name: 'id_user' })
    user: User


   


  
}