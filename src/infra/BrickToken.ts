/**
 * Represent Brick Token smart contract
 * for client side react
 * 
 * NOTE: this files won't be updated when deploying new contract 
 * Manually set BRT_ABI and BRT_TOKEN_ADDRESS to 
 * run the game properly
 * 
 */
import { web3 } from './web3';
import { Config } from '../game-components/config';

const { BRT_ABI, BRT_TOKEN_ADDRESS, OWNER_ADDRESS } = Config;

export async function getTokenContract() {
    return await new web3.eth.Contract(BRT_ABI, BRT_TOKEN_ADDRESS);
}

export const CREATOR = OWNER_ADDRESS;
