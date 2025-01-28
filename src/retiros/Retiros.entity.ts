 
  import { Transaction } from "src/transaccion/transaction.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'retiros'})
export class Retiros{

  @PrimaryGeneratedColumn()
    id: number;

 

@Column({type: 'decimal', precision: 10, scale: 2, default: 0.0 })
balance_retiro: number;
 
 
@Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
created_at: Date;

@Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
updated_at: Date;

   
@Column()
id_user:number;


 @ManyToOne(()=>User,(user)=>user.retiro)
 @JoinColumn(  {name: 'id_user' }) 
 user: User
}