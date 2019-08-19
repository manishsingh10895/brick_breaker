import Game from './game';

export default class Utils {

    constructor() {
    }

    drawOverlay(ctx: CanvasRenderingContext2D, game: Game) {
        ctx.rect(0, 0, game.gameWidth, game.gameHeight);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fill();
    }

    drawTextCenter(ctx: CanvasRenderingContext2D, text: string, game: Game) {
        ctx.rect(0, 0, game.gameWidth, game.gameHeight);
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fill();

        ctx.font = "30px Arial";
        ctx.fillStyle = 'white';
        ctx.textAlign = "center";
        ctx.fillText(text, game.gameWidth / 2, game.gameHeight / 2);
    }
}