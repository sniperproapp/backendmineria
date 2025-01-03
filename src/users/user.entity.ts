import { hash } from "bcrypt";
import { Cursos } from "src/cursos/Cursos.entity";
import { Products } from "src/products/products.entity";
import { Rol } from "src/roles/rol.entity";
import { Sale } from "src/sale/sale.entity";
import { Wallet } from "src/wallet/wallet.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastname: string;

      
    @Column({default: 0})
    estado: number;

    @Column({type: "decimal", precision: 20, scale: 10,default:0})
    saldo: number;

    @Column({unique:true})
    email: string;

 
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
 
@OneToOne(() => Wallet, (wallet) => wallet.user) // specify inverse side as a second parameter
    @JoinColumn({name:'id_wallet'})
    wallet: Wallet
}