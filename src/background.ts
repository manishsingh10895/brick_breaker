import { MBus } from "./infra/message-bus";
import { MessageChannels } from "./infra/message-channels";
import { web3, PayeeAccount } from './infra/web3';
import Game from "./game";
import { MessageData } from "./infra/message-data";
import { Subject } from "rxjs";
import Notifier from "./notifier";

export default class Background {
    payToLiveCount: number = 0;

    container: HTMLDivElement;

    timerPaused: boolean = false;

    paymentHandled: Subject<any> = new Subject<any>();

    constructor(private game: Game) {
        this.container = document.querySelector('.extra-life.container') as HTMLDivElement;

        this._addPaymentEventListeners();
    }

    _addPaymentEventListeners() {

        // let btnNotif: HTMLButtonElement = document.querySelector('.actions .btn-notif') as HTMLButtonElement;

        // btnNotif.addEventListener('click', (e) => {
        //     Notifier.Success("asdsadas");
        // });


        let btnPay: HTMLButtonElement = document.querySelector('.actions .btn-pay') as HTMLButtonElement;

        btnPay.addEventListener('click', async (e) => {
            try {
                let trx = {
                    from: "0x9554DB22446F60C8ACDd7FDf2f9f83780F0851e0",
                    to: PayeeAccount,
                    value: web3.utils.toWei("0.1", 'ether')
                };

                let s = await web3.eth.sendTransaction(trx);
                console.log(s);

                Notifier.Success("Payment succeeded");

                this.payToLiveCount++;

                this.paymentHandled.next({
                    paid: true
                });

                this.hidePaymentOptions();
            } catch (e) {
                Notifier.Error("Payment Error");

                console.error(e);
            }
        });


        let btnCancel: HTMLButtonElement = document.querySelector('.actions .btn-cancel') as HTMLButtonElement;

        btnCancel.addEventListener('click', (e) => {
            this._cancel();
        });
    }

    hidePaymentOptions() {
        this.container.classList.remove('active');
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
        this.container.classList.add('active');

        return this.paymentHandled;
    }

}