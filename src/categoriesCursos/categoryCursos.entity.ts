import { Cursos } from "src/cursos/Cursos.entity";
import { Products } from "src/products/products.entity";
import { BeforeInsert, Column, Entity,   OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'categories_cursos'})
export class CategoryCursos{

@PrimaryGeneratedColumn()
id: number

@Column({unique:true})
titulo: string;
 

 
@Column()
estado: number;

@Column()
image: string;

@Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
created_at: Date;

@Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
updated_at: Date;

@BeforeInsert()
async estadochage(){
    this.estado=1
}
   @OneToMany(()=>Cursos,cursos=>cursos.categorycurso)
  cursos: Cursos[]

}