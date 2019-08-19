import Game from "./game";
import { MBus } from "./infra/message-bus";
import { MessageChannels } from "./infra/message-channels";

export default class Audios {

    audios: { [name: string]: HTMLAudioElement } = {
        'ball_brick': (document.getElementById('ball_collision_sound') as HTMLAudioElement),
        'ball_paddle': (document.getElementById('ball_collision_sound') as HTMLAudioElement),
        'game_start': (document.getElementById('game_start_sound') as HTMLAudioElement),
        'game_over': (document.getElementById('game_over_sound') as HTMLAudioElement),
        'life_lost': (document.getElementById('game_over_sound') as HTMLAudioElement),
    }

    constructor() {
        Object.keys((this.audios))
            .forEach((k) => {
                // this.stop(k); 
            })

        this._subscribe();

    }

    play(sound: string) {
        if (!this.audios[sound]) throw new Error("Invalid sound provided");

        this.audios[sound].play();
    }

    stop(sound: string) {
        if (!this.audios[sound]) throw new Error("Invalid sound provided");

        this.audios[sound].pause();
    }

    _subscribe() {
        MBus.subscribeToChannel(MessageChannels.BALL_BRICK_COLLIDE)
            .subscribe(() => {
                this.play('ball_brick');
            });

        MBus.subscribeToChannel(MessageChannels.BALL_PADDLE_COLLIDE)
            .subscribe(() => {
                this.play('ball_paddle');
            })

        MBus.subscribeToChannel(MessageChannels.GAME_START)
            .subscribe(() => {
                this.play('game_start');
            })

        MBus.subscribeToChannel(MessageChannels.GAME_OVER)
            .subscribe(() => {
                this.play('game_over');
            })

        MBus.subscribeToChannel(MessageChannels.LIFE_LOST)
            .subscribe(() => {
                this.play('life_lost');
            })

    }
}