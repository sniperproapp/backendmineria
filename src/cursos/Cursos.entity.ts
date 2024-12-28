import { Category } from "src/categories/category.entity";
import { CategoryCursos } from "src/categoriesCursos/categoryCursos.entity";
import { Saledetail } from "src/saledetail/saledetail.entity";
import { SectionCursos } from "src/section/SectionCursos.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'cursos'})
export class Cursos{

    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    title:string;

    @Column()
    slug:string;

   
    @Column({default:1})
    estado:number;
   
   
    @Column()
    subtitle:string;

    @Column()
    description:string;
   
    @Column()
    price_pesos: number;
   
    @Column()
    price_usd: number;
   
    @Column({nullable:true})
    imagen: string;
    @Column({nullable:true})
    vimeo_id: string;
    @Column({nullable:true})
    level: string;
    @Column({nullable:true})
    idioma: string;
    @Column({nullable:true})
    requirements: string;
    @Column({nullable:true})
    who_is_it_for: string;

 
    @Column()
    id_category_curso:number;
    @Column()
    id_user:number;
    
      
    
    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    updated_at: Date;

    @OneToMany(()=>SectionCursos,sectionCursos=>sectionCursos.cursos)
    seciones: SectionCursos[]

    @OneToMany(()=>Saledetail,saledetail=>saledetail.cursos)
    saledetail: Saledetail[]
    
    @ManyToOne(()=>CategoryCursos,(categorycurso)=> categorycurso.cursos)
    @JoinColumn(  {name: 'id_category_curso' })
    categorycurso: CategoryCursos

  

    @ManyToOne(()=>User,(user)=>user.id)
    @JoinColumn(  {name: 'id_user' })
    user: User


   
}