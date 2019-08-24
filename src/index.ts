import Game from './game';
import Utils from './utils';
import { inherits } from 'util';

const GAME_HEIGHT: number = 600;
const GAME_WIDTH: number = 800;

let name: string;
let address: string = "0xcb2B0245F06897D81e43B0a45C3D7AE781CD50c0";

function askUserAddress() {
    let userInfoContainer: HTMLDivElement = document.getElementById('user-info') as HTMLDivElement;

    userInfoContainer.style.display = 'block';

    let nameInput = document.getElementById('name') as HTMLInputElement;
    let addressInput = document.getElementById('eth-address') as HTMLInputElement;


    let btn = document.getElementById('submitAction') as HTMLButtonElement;

    btn.addEventListener('click', () => {
        
        name = nameInput.value;
        address = addressInput.value;

        console.log(name, address);

        setTimeout(() => {
            userInfoContainer.style.display = 'none';
            init();
        }, 500);
    });
}

function init() {

    let canvas: HTMLCanvasElement = document.getElementById('gameScreen') as HTMLCanvasElement;

    canvas.style.display = 'block';

    let ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    let game = new Game(GAME_WIDTH, GAME_HEIGHT, Utils, ctx, { name: name, address: address });

    let lastTime = 0;

    function gameLoop(timestamp: number = 0) {
        let dt: number = timestamp - lastTime;

        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        game.ticks++;
        game.update(dt);
        game.draw(ctx)

        requestAnimationFrame(gameLoop);
    }

    let now = Date.now();

    requestAnimationFrame(gameLoop);

}

window.addEventListener('load', () => {
    //    init();
    askUserAddress();
});