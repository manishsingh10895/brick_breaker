import { MBus } from "../infra/message-bus";
import { MessageChannels } from "../infra/message-channels";
import { web3, PayeeAccount } from '../infra/web3';
import Game from "./game";
import { MessageData } from "../infra/message-data";
import { Subject } from "rxjs";
import Notifier from "./notifier";
import { Config } from "./config";

export default class Background {
    payToLiveCount: number = 0;

    container: HTMLDivElement;

    timerPaused: boolean = false;

    paymentHandled: Subject<any> = new Subject<any>();

    constructor(private game: Game) {
        this.container = document.querySelector('.extra-life.container') as HTMLDivElement;
    }

    hidePaymentOptions() {
        this.game.gameContext.hidePaymentOptions();
    }

    resetPaymentCount() {
        this.payToLiveCount = 0;
    }

    /**
     * cancel payment an move on
     */
    _cancel() {
        this.hidePaymentOptions();

        this.paymentHandled.next();
    }

    /**
     * Render and displays payment option to extend lives
     */
    showPaymentOption(): Subject<any> {
        this.game.gameContext.showPaymentOptions();

        return this.paymentHandled;
    }

    /**
     * Send user collected BRT token
     * 
     * @param coins number of BRT tokens to send
     */
    async sendUserCoins(coins: number) {
        try {
            let result = await fetch('http://localhost:5000/api/giveToken', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({
                    address: this.game.userDetails.address,
                    count: coins
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(result);

            Notifier.Success("You should receive tokens in you account");

            MBus.publishData(new MessageData(MessageChannels.COINS_SENT));

        } catch (e) {
            console.error(e);
        }
    }

}