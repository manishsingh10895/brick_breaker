import Game from "./game";
import { Pos } from "../infra/pos";
import { GameObject } from "../infra/gameObject";
import { MBus } from "../infra/message-bus";
import { MessageChannels } from "../infra/message-channels";
import { BallState } from "./ball";


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

    celebrationColors: Array<string> = ['#FFEE58', '#FFEB3B', '#FDD835', '#FBC02D'];

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


        /**
         * Note :: 
         * There's a problem in coin - paddle collision detection
         * coin center apparently moves much lower, that it is visually
         */
        if (this.state == State.CELEBRATING) {
            let i = Math.floor(this.game.ticks / 2) % 4;

            ctx.fillStyle = this.celebrationColors[i];
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }

    /**
     * If ball is not rolling set it rolling after some user interaction
     */
    _setBallRolling() {
        if (this.game.ball.state == BallState.RESPAWNED) {
            this.game.ball.state = BallState.ROLLING
        }
    }


    moveLeft() {

        this._setBallRolling();

        this.speed = -this.maxSpeed;
    }

    moveRight() {

        this._setBallRolling();

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