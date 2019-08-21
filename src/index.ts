import Game from './game';
import Utils from './utils';
import { inherits } from 'util';

const GAME_HEIGHT: number = 600;
const GAME_WIDTH: number = 800;

function init() {

    let canvas: HTMLCanvasElement = document.getElementById('gameScreen') as HTMLCanvasElement;

    let ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    let game = new Game(GAME_WIDTH, GAME_HEIGHT, Utils, ctx);

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
    init();
});