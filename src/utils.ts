import Game from './game';
import { Pos } from './infra/pos';
import { GameObject } from './infra/gameObject';

export class Utils {

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

    /**
     * Get center for an game object
     * @param position position of the object
     * @param w width
     * @param h heigh
     */
    getCenter(gameObject: GameObject): Pos {
        return {
            x: gameObject.position.x + (gameObject.width / 2),
            y: gameObject.position.y + (gameObject.height / 2)
        }
    }
}

export default new Utils();