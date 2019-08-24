/**
 * Represent Brick Token smart contract
 */
import migrations from './migrations.json';
import { web3 } from './web3';
import fs from 'fs-extra';

console.log(migrations);

const migration = migrations['BrickToken'];

const { abi, address, creator } = migration;

export async function getTokenContract() {
    return await new web3.eth.Contract(abi, address);
}

export const CREATOR = creator;
