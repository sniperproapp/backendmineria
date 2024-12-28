import { ClaseCursos } from "src/clase/ClaseCursos.entity";
import { Cursos } from "src/cursos/Cursos.entity";
 
import { BeforeInsert, Column, Entity,   JoinColumn,   ManyToOne,   OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'Section_cursos'})
export class SectionCursos{

@PrimaryGeneratedColumn()
id: number

@Column()
title: string;
 

 
@Column()
estado: number;

 
@Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
created_at: Date;

@Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
updated_at: Date;



@BeforeInsert()
async estadochage(){
    this.estado=1
}
@Column()
id_curso:number;


 @ManyToOne(()=>Cursos,(cursos)=>cursos.seciones)
 @JoinColumn(  {name: 'id_curso' }) 
 cursos: Cursos

 @OneToMany(()=>ClaseCursos,claseCursos=>claseCursos.sectionCursos)
 clases: ClaseCursos[]

}