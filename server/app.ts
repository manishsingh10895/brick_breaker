import express = require('express');
import bodyParser = require('body-parser');
import cors = require('cors');
import { web3 } from './web3';
import { Controller } from './controller';

const app: express.Application = express();

let controller = new Controller();

app.use(cors());
app.use(bodyParser());

app.get('/', (req, res) => {
    res.send("SDsd");
});

app.post('/giveToken', controller.giveToken.bind(this));

app.post('')


let port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("server running at - " + port);
});