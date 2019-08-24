import { getTokenContract } from './BrickToken';

async function run() {
    let contract = await getTokenContract();

    let res = await contract.methods.balanceOf('0x07E5bc5CC80Ae25d8C46430002f3Cd2FD3CC5a68').call()

    console.log("Number of tokens");

    console.log(res);
}


run();