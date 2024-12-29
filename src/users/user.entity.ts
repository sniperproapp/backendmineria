import { hash } from "bcrypt";
import { Cursos } from "src/cursos/Cursos.entity";
import { Products } from "src/products/products.entity";
import { Rol } from "src/roles/rol.entity";
import { Sale } from "src/sale/sale.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastname: string;

    @Column({default:0})
    duplicatesesion: number;
   
    @Column({default:0})
    descargo: number;

    
    @Column({default:0})
    mensaje: number;

    @Column({default: 0})
    estado: number;


    @Column({unique:true})
    email: string;


    @Column({default: 0})
    phone: string;


    @Column()
    password: string;
    @Column()
    tokenpass: string;
    @Column({nullable:true})
    notification_token: string;

    @Column({nullable:true})
    imagen: string;

    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
    updated_at: Date;

    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'})
     time_limit: Date;


    @JoinTable(
        {name:'user_has_roles',
        joinColumn:{
              name:'id_user'
            },
        inverseJoinColumn:{
            name:'id_rol'
        }
        }
    )



    
    @ManyToMany(()=>Rol,(rol)=>rol.users)
    roles: Rol[];

    @OneToMany(()=>Products,products=>products.id)
    products: Products

    @OneToMany(()=>Sale,sale=>sale.user)
    sales: Sale[]
    
@BeforeInsert()
async hashPassword(){
    this.password=await hash(this.password,Number(process.env.HASH_SALT))
}
// @BeforeUpdate()
// async hashPasswordupdate(){
//     if(this.password!=''){
//     this.password=await hash(this.password,Number(process.env.HASH_SALT))}
// }
 

}