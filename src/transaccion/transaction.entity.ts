 
import { Currency } from "src/currecy/currency.entity";
import { Wallet } from "src/wallet/wallet.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'transaction'})
export class Transaction{

@PrimaryGeneratedColumn()
id: number


@Column({  length:100,nullable: false })
idhash: string;


 
@Column({ length:100,  nullable: false })
walletId: string;

@Column()
date: Date;

@Column()
description: string;

@Column( )
from: string;

@Column( )
to: string;

@Column({ nullable: false })
amount: number;

  @ManyToOne(() => Currency, currency => currency.transactions)
 currency: Currency;

@ManyToOne(() => Wallet, wallet => wallet.transactions)
wallet: Wallet;
}