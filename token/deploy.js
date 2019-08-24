const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const fs = require('fs-extra');
const argv = require('minimist')(process.argv.slice(2));
const config = require('./config');

let contractBuild = argv.contract || './build/BrickToken.json';

if (!contractBuild) {
    console.error("No contract provided");
    process.exit(1);
}

let x = contractBuild.split('/');

let contractFileName = x[x.length - 1];
let contractName = contractFileName.split('.')[0];

const { abi, evm } = require(contractBuild);

const network = argv.network || 'local';

let provider;

if (network !== 'local') {
    provider = new HDWalletProvider(
        config.networks[network].mnemonic,
        config.networks[network].uri
    );
} else provider = new Web3.providers.HttpProvider(config.networks.local.uri);

const web3 = new Web3(provider);

let arguments = [];

switch (contractName.toLowerCase()) {
    case 'bricktoken':
        arguments = ["Brick Token", "BRT", 5000000000];
        break;
    default: break;
}

function writeMigration(contractName, abi, address, creator) {
    let migrationFile = __dirname + '/migrations.json';

    let migrations = fs.readJSONSync(migrationFile);

    let found = false;

    Object.keys(migrations)
        .forEach((k) => {
            if (k === contractName) {
                migrations[k] = {
                    abi: abi,
                    address: address,
                    creator: creator
                }

                found = true;
            }
        });

    if (!found) {
        migrations[contractName] = {
            abi: abi,
            address: address,
            creator: creator
        }
    }

    console.log(migrations);

    fs.writeJSONSync(migrationFile, migrations);

    console.log("MIGRATION added");
}

const deploy = async () => {
    try {
        const accounts = await web3.eth.getAccounts();

        console.log('Attempting to deploy from account', accounts[0]);

        console.log("DEPLOYING CONTRACT", contractName);

        const result = await new web3.eth.Contract(abi)
            .deploy({ data: '0x' + evm.bytecode.object, arguments: arguments })
            .send({ gas: '3000000', from: accounts[0] });

        console.log('Contract deployed to', result.options.address);
        console.log("Contract deployed by", accounts);
        console.log(accounts[0])

        writeMigration(contractName, abi, result.options.address, accounts[0]);

        process.exit(0);

    } catch (e) {
        console.log("=======================ERRRRORR=======================");
        console.error(e);
    }
};
deploy();