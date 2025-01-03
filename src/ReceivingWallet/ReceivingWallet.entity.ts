 
import { Transaction } from "src/transaccion/transaction.entity";
import { Column, Entity, JoinColumn, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'ReceivingWallet'})
export class ReceivingWallet{

@PrimaryGeneratedColumn()
id: number


@Column()
address: string;
@Column()
lastBlock: string;
}