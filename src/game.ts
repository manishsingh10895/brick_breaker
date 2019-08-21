import Ball from "./ball";
import Paddle from "./paddle";
import InputHandler from "./input";
import { GameObject } from "./infra/gameObject";
import Brick from './brick';
import { buildLevel, GAME_LEVELS } from "./levels";
import { Utils } from './utils';
import { GAME_STATE } from "./infra/gamestate";
import LivesText from "./lives-text";
import { MBus } from "./infra/message-bus";
import { MessageData } from "./infra/message-data";
import { MessageChannels } from "./infra/message-channels";
import Scorer from './scorer';
import ScoreText from "./score-text";
import Background from "./background";
import { Config } from './config';
import Coin, { CoinState } from "./coin";

export default class Game {
    paddle!: Paddle;
    ball!: Ball;
    scoreText: ScoreText;
    livesText: LivesText;

    bricks: Array<Brick> = [];

    coins: Array<Coin> = [];

    gameObjects: Array<GameObject> = [];

    gameState: GAME_STATE = GAME_STATE.MENU;

    lives: number = Config.LIVES;

    levels: Array<Array<Array<number>>> = GAME_LEVELS;

    currentLevel: number = 0;

    newLevelTimeout: any;

    scorer: Scorer;

    background: Background;

    //TimeElapsed in seconds
    timeElapsed: number = 0;

    timeInterval: any;

    ticks: number = 0;

    constructor(
        public gameWidth: number,
        public gameHeight: number,
        private _utils: Utils,
        public ctx: CanvasRenderingContext2D
    ) {
        this.ball = new Ball(this);
        this.paddle = new Paddle(this);
        this.livesText = new LivesText(this);
        this.scoreText = new ScoreText(this);
        this.background = new Background(this);

        this.scorer = new Scorer();

        new InputHandler(this);
    }

    togglePause() {
        if (this.gameState != GAME_STATE.PAUSED)
            this.gameState = GAME_STATE.PAUSED;
        else
            this.gameState = GAME_STATE.RUNNING;
    }

    /**
     * Actual start point for the game
    */
    start() {
        MBus.publishData(new MessageData(MessageChannels.GAME_START));

        this._resetGame();

        this.gameState = GAME_STATE.RUNNING;

        this.bricks = buildLevel(this, this.levels[this.currentLevel]);

        this.gameObjects = [
            this.ball, this.paddle, this.livesText, this.scoreText
        ];

        this.timeInterval = setInterval(() => {
            this.timeElapsed++;
        }, 1000);
    }

    _resetGame() {
        this.currentLevel = 0;
        this.lives = Config.LIVES;

        this.scorer.resetScore();
        this.background.resetPaymentCount();

        this.timeElapsed = 0;

        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
    }

    /**
     * Make relevant change to render a new level
     */
    _newLevel(ctx: CanvasRenderingContext2D) {
        this._drawNewLevel(ctx);

        if (!this.newLevelTimeout) {

            this.newLevelTimeout = setTimeout(() => {

                this.bricks = buildLevel(this, this.levels[this.currentLevel]);

                this.ball.reset();

                this.ball.increaseSpeed();

                console.log(this.ball.position);

                this.gameState = GAME_STATE.RUNNING;

                clearTimeout(this.newLevelTimeout);
            }, 2000);
        }
    }

    /**
     * Updates the game loop
     * @param dt difference in time
     */
    update(dt: number) {
        if (
            this.gameState === GAME_STATE.PAUSED
            || this.gameState === GAME_STATE.MENU
            || this.gameState === GAME_STATE.LIVES_ENDED
            || this.gameState === GAME_STATE.GAMEOVER
            || this.gameState === GAME_STATE.NEW_LEVEL
            || this.gameState === GAME_STATE.LOADING
        ) return;

        console.log(this.ticks);

        if (this.ticks % 724 == 0) {
            this.coins.push(new Coin(this));

            console.log(this.coins);
        }

        //0 lives game over
        if (this.lives == 0) {
            this.gameState = GAME_STATE.LIVES_ENDED;

            //If user has exceeded the number of times he can pay to extend life 
            // Do not show the payment option anymore
            // And directly take them to the game over screen
            if (this.background.payToLiveCount > Config.MAX_PAY_TO_LIVE_COUNT) {
                this._gameOver();
            } else {
                //Show user payment option to extend lives 

                let paymentHandled = this.background.showPaymentOption();

                let s = paymentHandled
                    .subscribe((res) => {
                        console.log(res);

                        //If user pays the amount then 
                        //Increase his live by one
                        // and let it run
                        if (res && res.paid) {
                            this.increaseLives();
                            this.gameState = GAME_STATE.RUNNING;
                        } else {
                            // This means there was an error or user cancelled the payment 
                            this._gameOver();
                        }

                        s.unsubscribe();
                    })
            }
        }

        //Load new level if all bricks cleared
        if (this.bricks.length == 0 && this.currentLevel < this.levels.length - 1) {
            this.currentLevel++;
            this.gameState = GAME_STATE.NEW_LEVEL;
        }

        [...this.gameObjects, ...this.bricks, ...this.coins].forEach((g) => {
            g.update(dt);
        });


        this._removeUnwantedGameObjects();
    }

    /**
     * Handle things after payment has been handled
     */
    _handlePaymentHandled() {
        MBus.publishData(new MessageData(MessageChannels.GAME_OVER));
        this.scorer.resetScore();
    }

    _removeUnwantedGameObjects() {
        // Delete bricks who have been touched by the ball
        this.bricks = this.bricks.filter(o => {
            return !o.toDelete;
        });

        this.coins = this.coins.filter((c: Coin) => {
            return c.state !== CoinState.COMPLETED;
        })
    }

    _gameOver() {
        this.gameState = GAME_STATE.GAMEOVER;
        MBus.publishData(new MessageData(MessageChannels.GAME_OVER));

        this.timeElapsed = 0;
        if (this.timeInterval) clearInterval(this.timeInterval);
    }

    /**
     * Draws all the game objects
     * @param ctx Canvas context
     */
    draw(ctx: CanvasRenderingContext2D) {
        [...this.gameObjects, ...this.bricks, ...this.coins].forEach((g) => {
            g.draw(ctx);
        });

        if (this.gameState == GAME_STATE.PAUSED) {
            this._drawPauseScreen(ctx);
        }

        if (this.gameState == GAME_STATE.MENU) {
            this._drawMenu(ctx);
        }

        if (this.gameState == GAME_STATE.GAMEOVER) {
            this._drawGameOver(ctx);
        }

        if (this.gameState == GAME_STATE.NEW_LEVEL) {
            this._newLevel(ctx);
        }

        if (this.gameState == GAME_STATE.LOADING) {
            //DO loading stuff
        }
    }

    /**
     * Icrement game lives by 1
     * and render text changes in lives counter
     */
    increaseLives() {
        this.lives++;

        this.livesText.renderLivesCountChange();
    }

    /**
     * Decrement lives by 1
     */
    reduceLives() {
        this.lives--;

        this.livesText.renderLivesCountChange();

        MBus.publishData(new MessageData(MessageChannels.LIFE_LOST));
    }


    _drawNewLevel(ctx: CanvasRenderingContext2D) {
        this._utils.drawOverlay(ctx, this);
        this._utils.drawTextCenter(ctx, "NEW LEVEL", this);
    }

    _drawPauseScreen(ctx: CanvasRenderingContext2D) {
        this._utils.drawOverlay(ctx, this);
        this._utils.drawTextCenter(ctx, "PAUSED", this);
    }

    _drawMenu(ctx: CanvasRenderingContext2D) {
        this._utils.drawOverlay(ctx, this);
        this._utils.drawTextCenter(ctx, "PRESS SPACEBAR TO START", this);
    }

    _drawGameOver(ctx: CanvasRenderingContext2D) {
        this._utils.drawOverlay(ctx, this);
        this._utils.drawTextCenter(ctx, "GAME OVER", this);
        ctx.fillText("SCORE " + this.scorer.currentScore, this.gameWidth / 2, (this.gameHeight) / 2 + 50);
        ctx.fillText("COINS COLLECTED " + this.scorer.coinsCollected, this.gameWidth / 2, (this.gameHeight) / 2 + 100);
    }



}