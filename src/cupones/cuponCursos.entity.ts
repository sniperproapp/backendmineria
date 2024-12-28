 
 
import { BeforeInsert, Column, Entity,   JoinColumn,   ManyToMany,   OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'Cupones_cursos'})
export class CuponCursos{

@PrimaryGeneratedColumn()
id: number

@Column({unique:true})
code: string;

@Column()
type_discount: number;

@Column()
discount: number;
@Column()
type_count: number;

@Column()
num_use: number;
@Column()
type_cupon: number;
 
 

 
@Column()
state: number;


@Column('simple-array')
courses: number[];

@Column('simple-array')
categories: number[];
 

 
@Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
created_at: Date;

@Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
updated_at: Date;

 

 

@BeforeInsert()
async estadochage(){
    this.state=1
}
 

 

}