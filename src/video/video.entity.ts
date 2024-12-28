import { hash } from "bcrypt";
import { Products } from "src/products/products.entity";
import { Rol } from "src/roles/rol.entity";
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'videos'})
export class Video{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    link: string;

    @Column()
    name: string;

    @Column()
    description: string;
    @Column()
    image: string;
    

    

    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    updated_at: Date;

  


}