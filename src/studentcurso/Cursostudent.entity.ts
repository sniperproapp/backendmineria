import { Category } from "src/categories/category.entity";
import { CategoryCursos } from "src/categoriesCursos/categoryCursos.entity";
import { Cursos } from "src/cursos/Cursos.entity";
import { SectionCursos } from "src/section/SectionCursos.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'Cursostudent'})
export class Cursostudent{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_curso:number;
    @Column()
    id_user:number;
    

    @Column('simple-array',{ nullable: true })
    clases_checked:string[];
    
   

    
    @Column({default:1})
    state:number 
  

    @ManyToOne(()=>User,(user)=>user.id)
    @JoinColumn(  {name: 'id_user' })
    user: User

    @ManyToOne(()=>Cursos,(curso)=>curso.id)
    @JoinColumn(  {name: 'id_curso' })
    curso: Cursos




   
}