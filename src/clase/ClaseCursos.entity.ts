import { Cursos } from "src/cursos/Cursos.entity";
import { FileCursos } from "src/files/FileCursos.entity";
import { SectionCursos } from "src/section/SectionCursos.entity";
 
import { BeforeInsert, Column, Entity,   JoinColumn,   ManyToMany,   ManyToOne,   OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'Clase_cursos'})
export class ClaseCursos{

@PrimaryGeneratedColumn()
id: number

@Column( )
title: string;

@Column()
description: string;

@Column()
vimeo_id: string;

@Column()
time: string;
 

 
@Column()
estado: number;

 
@Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
created_at: Date;

@Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
updated_at: Date;

@Column()
id_sectionCursos:number;

 

@BeforeInsert()
async estadochage(){
    this.estado=1
}
 @ManyToOne(()=>SectionCursos,(sectionCursos)=>sectionCursos.id)
 @JoinColumn(  {name: 'id_sectionCursos' })
 sectionCursos: SectionCursos


 

 @OneToMany(()=>FileCursos,filesCursos=>filesCursos.ClaseCursos)
  files: FileCursos[]

 

}