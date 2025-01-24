 
  import { Transaction } from "src/transaccion/transaction.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, JoinTable, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'wallet'})
export class Wallet{

    @PrimaryColumn({ length: 100 })
    id: string;

 

@Column({type: 'decimal', precision: 10, scale: 2, default: 0.0 })
balance: number;
@Column({type: 'decimal', precision: 10, scale: 2, default: 0.0 })
balance_minando: number;
@Column({type: 'decimal', precision: 10, scale: 2, default: 0.0 })
balance_ganancia: number;

  @OneToMany(() => Transaction, transaction => transaction.wallet)
  transactions: Transaction[];

  @OneToOne(() => User, (user) => user.wallet) // specify inverse side as a second parameter
    user: User
}