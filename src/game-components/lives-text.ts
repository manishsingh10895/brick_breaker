import { GameObject } from "../infra/gameObject";
import { Pos } from "../infra/pos";
import Game from "./game";
import { GAME_STATE } from "../infra/gamestate";

const DEFAULT_POS: Pos = {
    x: 10,
    y: 30
};



export default class LivesText implements GameObject {

    state: 'updating' | 'resting' = 'resting';

    position = { ...DEFAULT_POS };

    height: number = 100;

    width: number = 100;

    constructor(private game: Game) {

    }

    draw(ctx: CanvasRenderingContext2D) {

        if (this.state == 'resting') {
            ctx.textAlign = "left";
            ctx.font = "30px Arial";
            ctx.fillText("LIVES - " + this.game.lives.toString(), this.position.x, this.position.y);
        }

        if (this.state == 'updating') {
            ctx.textAlign = 'left';
            ctx.font = "30px Arial";
            ctx.fillText("LIVES - " + this.game.lives.toString(), this.position.x, this.position.y);
        }

    }

    update(dt: number) {
        if (this.state == 'resting') {
            this.position = { ...DEFAULT_POS };
        };

        if (this.state == 'updating') {

            if (Math.abs(this.position.y - DEFAULT_POS.y) < 40) {
                this.position.y--;
            } else this.state = 'resting';

        }
    }

    renderLivesCountChange() {
        this.state = 'updating';
    }

}