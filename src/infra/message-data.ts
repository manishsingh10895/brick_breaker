import { MessageChannels } from "./message-channels";

export class MessageData {
    channel: MessageChannels;
    data: any;

    constructor(_channel: MessageChannels, _data?: any) {
        this.channel = _channel;
        this.data = _data;
    }
}