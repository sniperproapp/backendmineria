 
import { Transaction } from "src/transaccion/transaction.entity";
import { Column, Entity, JoinColumn, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'currency'})
export class Currency{

@PrimaryGeneratedColumn()
id: number

@Column({ nullable: false })
name: string;

@Column({ nullable: false   })
symbol: string;

@Column({ nullable: false })
decimals: number;

@Column({ nullable: false  })
contract: string;

@Column({ nullable: false })
url: string;

@OneToMany(() => Transaction, transaction => transaction.currency)
transactions: Transaction[];
}
 