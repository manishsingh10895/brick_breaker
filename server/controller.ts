import { Request, Response } from "express";
import { web3 } from './web3';
import { getTokenContract, CREATOR } from './BrickToken';
import { Config } from "./config";


export class Controller {

    constructor() { }

    async giveToken(req: Request, res: Response) {
        console.log(req.body);

        let options = req.body;

        if (!options.count) {
            res.status(400).send({ error: 'Invalid token count' });
        }

        if (!options.address) {
            res.status(400).send({ error: 'Invalid Address' });
        }

        try {

            let contract = await getTokenContract();

            let result = await contract.methods.transfer(options.address, options.count).send({
                from: CREATOR
            });

            console.log(result);

            res.status(200).send(result);

        } catch (e) {
            console.error(e);
            res.status(500).send(e);
        }


    }

    /**
     * Gets number of coins available at an address
     * @param req 
     * @param res 
     */
    async fetchTokens(req: Request, res: Response) {
        console.log(req.body);

        let options = req.body;

        if (!options.address) {
            res.status(400).send({ error: 'Invalid Address' });
        }

        try {

            let contract = await getTokenContract();

            let result = await contract.methods.balanceOf(options.address).call();

            console.log(result);

            res.status(200).send(result);

        } catch (e) {
            console.error(e);
            res.status(500).send(e);
        }


    }

}