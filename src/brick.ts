import { GameObject } from './infra/gameObject';
import Game from './game';
import { Pos } from './infra/pos';
import { detectBallCollision } from './collisionDetection';
import Audios from './audios';
import { Observable, Observer } from 'rxjs';
import { MBus } from './infra/message-bus';
import { MessageData } from './infra/message-data';
import { MessageChannels } from './infra/message-channels';

export default class Brick implements GameObject {
    width: number = 50;
    height: number = 24;

    position: Pos;

    audios: Audios = new Audios();

    center: Pos;

    image: HTMLImageElement;

    toDelete: boolean = false;

    constructor(private game: Game, _position: Pos) {

        this.image = document.getElementById('img_brick') as HTMLImageElement;

        this.position = _position;

        this.center = {
            x: _position.x + (this.width / 2),
            y: _position.y + (this.height / 2)
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update(dt: number) {

        // TODO :: Better collision detection
        // Way better
        let collision = detectBallCollision(this.game.ball, this);
        if (collision.collided) {

            if (collision.side && (collision.side == 'left' || collision.side == 'right')) {
                this.game.ball.speed.x = -this.game.ball.speed.x;
            } else {
                this.game.ball.speed.y = -this.game.ball.speed.y;
            }


            console.log(collision.side);

            console.log(this.game.ball.speed);

            this.toDelete = true;

            this.game.scorer.incrementScore();

            MBus.publishData(new MessageData(MessageChannels.BALL_BRICK_COLLIDE));
        }

    }

}