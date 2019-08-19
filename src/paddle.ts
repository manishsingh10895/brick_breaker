import Game from "./game";
import { Pos } from "./infra/pos";
import { GameObject } from "./infra/gameObject";


export default class Paddle implements GameObject {

    width: number;
    height: number;

    position: Pos;

    maxSpeed: number = 7;
    speed: number = 0;

    constructor(private game: Game) {
        this.width = 150;
        this.height = 20;

        this.position = {
            y: this.game.gameHeight - (this.height + 10),
            x: (this.game.gameWidth / 2) - (this.width / 2)
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#0ff';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    moveLeft() {
        this.speed = -this.maxSpeed;
    }

    moveRight() {
        this.speed = this.maxSpeed;
        console.log(this.speed);
    }

    stop() {
        this.speed = 0;
    }

    update(dt: number) {
        if (dt == 0) {
            dt = 1;
        }
        this.position.x += this.speed;

        if (this.position.x < 0) this.position.x = 0;
        if ((this.position.x + this.width) > this.game.gameWidth) this.position.x = this.game.gameWidth - this.width;
    }
}