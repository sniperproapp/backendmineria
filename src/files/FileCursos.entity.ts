 
 
import { ClaseCursos } from "src/clase/ClaseCursos.entity";
import {  Column, Entity,   JoinColumn,   ManyToOne,   OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'File_cursos'})
export class FileCursos{

@PrimaryGeneratedColumn()
id: number

@Column({unique:true})
file: string;

@Column()
file_name: string;

@Column()
size: number;

 
 

 
@Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
created_at: Date;

@Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
updated_at: Date;

@Column()
id_sectionCursosclasefile:number;

 
 
@ManyToOne(()=>ClaseCursos,(ClaseCursos)=>ClaseCursos.files)
 @JoinColumn(  {name: 'id_sectionCursosclasefile' })
 ClaseCursos: ClaseCursos

 
}