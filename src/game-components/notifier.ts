export default class Notifier {

    static _createNotifier(type: string, message: string) {
        let div: HTMLDivElement = document.createElement('div');

        div.id = "notifier";
        div.className = "notifier show " + type;

        let text = document.createElement('span');

        text.innerHTML = message;

        div.appendChild(text);

        document.body.appendChild(div);

        let t = setTimeout(() => {
            div.classList.remove('show');
            if (div.parentNode) div.parentNode.removeChild(div);

            clearTimeout(t);
        }, 3000);


        return div;
    }

    static Success(message: string) {
        this._createNotifier('success', message);
    }

    static Error(message: string) {
        this._createNotifier('error', message);
    }

    static Info(message: string) {
        this._createNotifier('info', message);
    }

}