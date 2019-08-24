import Web3 = require('web3');
import HDWalletProvider = require('truffle-hdwallet-provider');

import { Config } from './config';

import minimist = require('minimist');
import { HttpProvider } from 'web3/providers';

const argv = minimist(process.argv.slice(2));

const network: string = argv.network || 'local';
const NETWORKS: any = Config.NETWORK;

let provider;

if (network !== 'local') {
    provider = new HDWalletProvider(
        NETWORKS[network].mnemonic,
        NETWORKS[network].uri
    )
} else {
    provider = new Web3.providers.HttpProvider(Config.NETWORK['local'].uri);
}

export const web3 = new Web3(provider);