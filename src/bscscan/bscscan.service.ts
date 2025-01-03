import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
 
 
 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
 
import { User } from 'src/users/user.entity';
 
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { IBscScanResponse } from 'src/interfaces/bscscan-response.interface';
import { IBscScanTransaction } from 'src/interfaces/bscscan-transaction.interface';

const apiUrl = 'https://api.bscscan.com/api';
const configService = new ConfigService();

@Injectable()
export class BscscanService {
    
    private key: string;
  private wallet: string;

  constructor() {
    this.loadSettings();
  }

  async getFirstBlock(): Promise<string> {
    const action = 'module=account&action=tokentx';
    const url = `${apiUrl}?${action}&address=${this.wallet}&startblock=0&endBlock=99999999&page=1&offset=1&sort=asc&apikey=${this.key}`;

    const response = await axios. get(url);
    if (response.status !== 200) {
      throw new Error(`Error code ${response.status} - ${response.statusText}`);
    }

    const bscScanResponse = response.data as IBscScanResponse<IBscScanTransaction[]>;
    const transactionArray = bscScanResponse.result;

    if (transactionArray.length === 0) {
      return '0';
    }

    return transactionArray[0].blockNumber;
  }

  async listTransactions(initialBlock = '0') {
    const action = 'module=account&action=tokentx';
    const url = `${apiUrl}?${action}&address=${this.wallet}&startblock=${initialBlock}&endBlock=99999999&sort=desc&apikey=${this.key}`;

    const response = await axios.get(url);
    if (response.status !== 200) {
      throw new Error(`Error code ${response.status} - ${response.statusText}`);
    }

    const bscScanResponse = response.data as IBscScanResponse<IBscScanTransaction[]>;
    return bscScanResponse.result;
  }

  private loadSettings() {
    const key = configService.get('BSCSCAN_KEY');
    if (!key) {
      throw new Error('BSCScan Key is undefined');
    }

    this.key = key;

    const wallet = configService.get('WALLET');
    if (!wallet) {
      throw new Error('Wallet is undefined');
    }

    this.wallet = wallet;
  }
}
