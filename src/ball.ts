import Game from "./game";
import { Speed } from "./infra/speed";
import { Pos } from "./infra/pos";
import { GameObject } from "./infra/gameObject";
import { detectCollision } from "./collisionDetection";
import { MBus } from "./infra/message-bus";
import { MessageChannels } from "./infra/message-channels";
import { MessageData } from "./infra/message-data";

const DEFAULT_POSITION: Pos = {
    x: 20,
    y: 500
}

const DEFAULT_SPEED: Speed = {
    x: 4,
    y: -4
}

export default class Ball implements GameObject {

    image: HTMLImageElement = document.getElementById('img_ball') as HTMLImageElement;

    speed: Speed;
    position: Pos;

    size: number = 16;

    width: number;
    height: number;

    center: Pos;


    constructor(private game: Game) {
        this.speed = { ...DEFAULT_SPEED };
        this.position = { ...DEFAULT_POSITION };

        this.width = this.size;
        this.height = this.size;

        this.center = {
            x: this.position.x + (this.width / 2),
            y: this.position.y + (this.height / 2)
        }
    }

    reset() {
        this.speed = { ...DEFAULT_SPEED }

        this.position = { ...DEFAULT_POSITION };
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.size, this.size);
        return;
    }

    update(dt: number) {
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        //Collides left or right
        if ((this.position.x + this.size) > this.game.gameWidth || this.position.x < 0) {
            this.speed.x = -this.speed.x;
        }

        //Collides bottom or top
        if ((this.position.y + this.size) > this.game.gameHeight || this.position.y < 0) {
            this.speed.y = -this.speed.y;
        }

        //Collides with paddle
        let collision = detectCollision(this, this.game.paddle);
        if (collision.collided) {
            this.speed.y = -this.speed.y;
            this.position.y = this.game.paddle.position.y - this.size;

            MBus.publishData(new MessageData(MessageChannels.BALL_PADDLE_COLLIDE));
        }

        //Reduce lives on colliding with the bottom layer
        if ((this.position.y + this.size) > this.game.gameHeight) {
            this.game.reduceLives();

            this.reset();
        }
    }
}