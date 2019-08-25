import * as React from 'react';
import { PayeeAccount, web3 } from './infra/web3';
import Notifier from './game-components/notifier';
import { Subject } from 'rxjs';
import GameContext, { GameContextType } from './gameContext/GameContext';
import Game from './game-components/game';

export default class PaymentOptions extends React.Component<{
    game: Game
}> {

    static contextType = GameContext;

    async payEth() {
        try {
            let addresses = await web3.eth.getAccounts();

            console.log(addresses)
            

            let trx = {
                from: addresses[0],
                to: PayeeAccount,
                value: web3.utils.toWei("0.1", 'ether')
            };

            let s = await web3.eth.sendTransaction(trx);
            console.log(s);

            Notifier.Success("Payment succeeded");

            this.props.game.background.payToLiveCount++;

            this.props.game.background.paymentHandled.next({
                paid: true
            });

            this.context.hidePaymentOptions();
        } catch (e) {
            console.error(e);
            Notifier.Error("Payment Error");
        }
    }

    cancel() {
        this.context.hidePaymentOptions();

        this.props.game.background.paymentHandled.next();
    }


    render() {
        return (
            <GameContext.Consumer>
                {
                    (context: GameContextType) => {
                        return <div className="container">
                            <div className="extra-life">
                                <div className="pay-text">
                                    Pay 0.1 eth to increase life
                            </div>
                                <div className="actions">
                                    <button onClick={this.payEth.bind(this)} className="btn btn-pay">
                                        Pay
                                    </button>

                                    <button onClick={this.cancel.bind(this)} className="btn btn-cancel negative">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                }
            </GameContext.Consumer>
        )
    }

}