import { GameObject } from "./infra/gameObject";
import { Pos } from "./infra/pos";
import Game from "./game";
import Utils from "./utils";
import { detectBallCollision, detectRectRectCollision } from "./collisionDetection";
import { MBus } from "./infra/message-bus";
import { MessageChannels } from "./infra/message-channels";
import { MessageData } from "./infra/message-data";

export enum CoinState {
    FALLING, TOUCHED, COMPLETED
}

export default class Coin implements GameObject {

    state: CoinState = CoinState.FALLING;

    position: Pos = {
        x: 0,
        y: 0
    };

    height: number = 32;
    width: number = 32;

    image: HTMLImageElement = document.getElementById('img_coin') as HTMLImageElement;

    active: boolean = false;

    center: Pos;

    constructor(private game: Game) {
        let wRand = Math.floor(Math.random() * this.game.gameWidth);

        let height = 0;

        this.position = {
            x: wRand,
            y: height
        };

        this.center = Utils.getCenter(this);

    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.state === CoinState.FALLING) {
            ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    }

    update(dt: number) {
        if (this.state !== CoinState.FALLING) return;

        this.center = Utils.getCenter(this);

        this.position.y++;

        if (this.position.y >= this.game.gameHeight) {
            this.state = CoinState.COMPLETED;
        }

        /**
         * Detect if coin touched the paddle
         */
        let collision = detectRectRectCollision(this.game.paddle, this);

        if (collision.collided) {
            this.game.scorer.incrementCoinCount();
            this.state = CoinState.COMPLETED;
            MBus.publishData(new MessageData(MessageChannels.COIN_PADDLE_COLLIDE));
        }
    }

    /**
     * Drops the coins at random X 
     */
    dropCoin() {
        let wRand = Math.floor(Math.random() * this.game.gameWidth);

        let height = 0;

        this.state = CoinState.FALLING;

        this.position = {
            x: wRand,
            y: height
        };
    }
}