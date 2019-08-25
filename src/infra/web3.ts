import Web3 from 'web3';
import { HttpProvider } from 'web3/providers';
import Notifier from '../game-components/notifier';
import { Config } from '../game-components/config';

let provider;

if (window.web3 && window.web3.currentProvider) {
    provider = window.web3.currentProvider;
}
else {
    Notifier.Error("Metamask not found, please install if first");

    throw new Error("Metamask not found");
}

export const web3 = new Web3(provider);

export const PayeeAccount = Config.OWNER_ADDRESS;
