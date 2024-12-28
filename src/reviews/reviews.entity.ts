 
import { Cursos } from "src/cursos/Cursos.entity";
import { Sale } from "src/sale/sale.entity";
import { Saledetail } from "src/saledetail/saledetail.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'reviews'})
export class Reviews{

    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    id_user:number;

    @Column()
    id_curso:number; 
    @Column()
    id_saledetail:number;
    



    @Column()
    rating:number;


    @Column({nullable: true})
    description:string;

    
    
     
    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    updated_at: Date;

    @ManyToOne(()=>Saledetail,(saledetail)=>saledetail.id)
    @JoinColumn(  {name: 'id_saledetail' })
    saledetail: Saledetail


    @ManyToOne(()=>Cursos,(curso)=>curso.id)
    @JoinColumn(  {name: 'id_curso' })
    cursos: Cursos

    @ManyToOne(()=>User,(user)=>user.id)
    @JoinColumn(  {name: 'id_user' })
    user: User


   


  
}