import { GameObject } from "./infra/gameObject";
import Game from "./game";
import { Pos } from "./infra/pos";

const DEFAULT_POS: Pos = {
    x: 10,
    y: 20
};

export default class ScoreText implements GameObject {
    // state: 'updating' | 'resting' = 'resting';

    position: Pos;

    defaultPosition: Pos;

    height: number = 100;

    width: number = 100;

    constructor(private game: Game) {

        this.defaultPosition = {
            x: game.gameWidth - 200,
            y: DEFAULT_POS.y
        }

        this.position = { ...this.defaultPosition };

        console.log(this.position);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.textAlign = "left";
        ctx.font = "normal 20px Arial";
        ctx.fillText("SCORE - " + this.game.scorer.currentScore.toString(), this.position.x, this.position.y);
        ctx.fillText("HIGH SCORE - " + this.game.scorer.highScore.toString(), this.position.x, this.position.y + 20);
    }

    update(dt: number) {

        // this.position = { ...this };


    }
}