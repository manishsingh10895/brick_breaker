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

}