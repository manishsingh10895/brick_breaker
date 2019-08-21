import Game from "./game";
import { Pos } from "./infra/pos";
import { GameObject } from "./infra/gameObject";
import { MBus } from "./infra/message-bus";
import { MessageChannels } from "./infra/message-channels";


enum State {
    CELEBRATING, NORMAL
}

export default class Paddle implements GameObject {


    celebrationTimeout: any;

    width: number;
    height: number;

    position: Pos;

    maxSpeed: number = 7;
    speed: number = 0;

    center: Pos;

    state: State = State.NORMAL;

    constructor(private game: Game) {
        this.width = 150;
        this.height = 20;

        this.position = {
            y: this.game.gameHeight - (this.height + 10),
            x: (this.game.gameWidth / 2) - (this.width / 2)
        }

        this.center = {
            x: this.position.x + (this.width / 2),
            y: this.position.y + (this.height / 2),
        }

        this._subscribe();
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.state == State.NORMAL) {
            ctx.fillStyle = '#0ff';
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        }

        if (this.state == State.CELEBRATING) {
            ctx.fillStyle = '#0f9009';
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
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

        this.position.x += this.speed;

        if (this.position.x < 0) this.position.x = 0;
        if ((this.position.x + this.width) > this.game.gameWidth) this.position.x = this.game.gameWidth - this.width;


        this.center = {
            x: this.position.x + (this.width / 2),
            y: this.position.y + (this.height / 2),
        };
    }



    _subscribe() {
        MBus.subscribeToChannel(MessageChannels.COIN_PADDLE_COLLIDE)
            .subscribe(() => {
                console.log("COIN PADDLE COLLIDE");

                this.state = State.CELEBRATING;

                let t = setTimeout(() => {
                    this.state = State.NORMAL;
                    clearTimeout(t);
                }, 1000);
            });

    }
}