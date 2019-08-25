import * as React from 'react';
import Game from './game-components/game';
import Utils from './game-components/utils';
import { UserInfo } from './infra/userInfo';
import GameContext, { GameContextType } from './gameContext/GameContext';
import { RouteComponentProps, withRouter } from 'react-router';
import Notifier from './game-components/notifier';
import PaymentOptions from './payment-options';
import './game-styles.scss';
import { getTokenContract } from './infra/BrickToken';
import { Subject } from 'rxjs';
import { MBus } from './infra/message-bus';
import { MessageChannels } from './infra/message-channels';
import { takeUntil } from 'rxjs/operators';

const GAME_HEIGHT: number = 600;
const GAME_WIDTH: number = 800;
const canvasStyle = {
    display: 'none'
}

function init(userInfo: UserInfo, gameContext: GameContextType): Game {

    let canvas: HTMLCanvasElement = document.getElementById('gameScreen') as HTMLCanvasElement;

    canvas.style.display = 'block';

    let ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    let game = new Game(GAME_WIDTH, GAME_HEIGHT, Utils, ctx, userInfo, gameContext);

    let lastTime = 0;

    function gameLoop(timestamp: number = 0) {
        let dt: number = timestamp - lastTime;

        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        game.ticks++;
        game.update(dt);
        game.draw(ctx)

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);

    return game;
}

class GameScreen extends React.Component<RouteComponentProps<any>> {

    static contextType = GameContext;

    game: Game;

    state = {
        brickTokens: 0
    };

    destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(props: any) {
        super(props);
        console.log(props);
    }

    async _fetchBrickTokens() {
        try {
            let contract = await getTokenContract();

            let res = await contract.methods.balanceOf(this.context.userInfo.address).call()

            console.log(res);
            return res;
        } catch (e) {
            Notifier.Error("Failed to update token count, please check network");
            console.error(e);

            return null;
        }
    }

    /**
     * Updates brick token count in user address
     */
    async _fetchUpdateBrickTokenCount() {
        let tokens = await this._fetchBrickTokens();

        this.setState({
            brickTokens: tokens
        });
    }

    componentDidMount() {

        if (!this.context.userInfo || this.context.userInfo.address === '') {

            Notifier.Error("Address not Provided");

            this.props.history.push('/');

            return;
        }

        this.game = init(this.context.userInfo, this.context);

        this._fetchUpdateBrickTokenCount();

        this._subscribe();
    }

    _renderPaymentOptions() {
        if (this.context.paymentOptionsVisible) {
            return <div className="payment-options-container">
                <PaymentOptions game={this.game}></PaymentOptions>
            </div>
        } else {
            return null;
        }
    }

    render() {
        return (
            <GameContext.Consumer>
                {
                    (context: GameContextType) => {
                        return <div className="flex-center game-container">
                            <canvas style={canvasStyle} id="gameScreen" width="800" height="600"></canvas>

                            <div className="user-tokens">

                                Tokens available in your account - <span>{this.state.brickTokens} BRT</span>

                            </div>

                            {this._renderPaymentOptions()}
                        </div>
                    }
                }

            </GameContext.Consumer>
        )

    }

    _subscribe() {

        let interval: NodeJS.Timeout;
        let counter = 0;
        let maxCount = 3;

        MBus.subscribeToChannel(MessageChannels.COINS_SENT)
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                interval = setInterval(async () => {
                    if (counter >= maxCount) {
                        clearInterval(interval);
                    }

                    let tokens = await this._fetchBrickTokens();

                    if (tokens == this.state.brickTokens) {
                        counter++;
                    } else {
                        this.setState({
                            brickTokens: tokens
                        });

                        clearInterval(interval);
                    }
                }, 5000)

            })

    }

    componentWillUnmount() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

export default withRouter(GameScreen);