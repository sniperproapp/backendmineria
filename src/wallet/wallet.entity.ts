 
  import { Transaction } from "src/transaccion/transaction.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, JoinTable, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'wallet'})
export class Wallet{

    @PrimaryColumn({ length: 100 })
    id: string;

 

@Column({ nullable: false })
balance: number;
@Column({ nullable: false })
balance_minando: number;
@Column({ nullable: false })
balance_ganancia: number;

  @OneToMany(() => Transaction, transaction => transaction.wallet)
  transactions: Transaction[];

  @OneToOne(() => User, (user) => user.wallet) // specify inverse side as a second parameter
    user: User
}