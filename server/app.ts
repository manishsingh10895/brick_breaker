import express = require('express');
import bodyParser = require('body-parser');
import cors = require('cors');
import { web3 } from './web3';
import { Controller } from './controller';
import { join } from 'path';

const app: express.Application = express();

let controller = new Controller();

app.use(cors());
app.use(bodyParser());
app.use(express.static(join(__dirname, '../')));

app.get('/', (req, res) => {
    console.log(__dirname);
    res.sendFile(join(__dirname, '../index.html'));
});

app.post('/api/giveToken', controller.giveToken.bind(this));

app.post('/api/getTokens', controller.fetchTokens.bind(this));

let port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("server running at - " + port);
});