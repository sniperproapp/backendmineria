 
 
import { BeforeInsert, Column, Entity,     PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'descuento_cursos'})
export class DescuentoCursos{

@PrimaryGeneratedColumn()
id: number

 

@Column()
type_campaign: number;
@Column()
type_discount: number;

@Column()
type_segment: number;
@Column()
discount: number;
@Column()
type_count: number;

 
 
 

 
@Column()
state: number;


@Column('simple-array')
courses: number[];

@Column('simple-array')
categories: number[];
 
@Column({type:'datetime'})
start_date: Date;
@Column({type:'datetime'})
end_date: Date;
 

@Column( { type: 'decimal'   })
start_date_num: number;
@Column(   { type: 'decimal' })
end_date_num: number;
@Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
created_at: Date;

@Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
updated_at: Date;

 

 

@BeforeInsert()
async estadochage(){
    this.state=1
}
 

 

}