import { MessageChannels } from './message-channels';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { MessageData } from "./message-data";

class MessageBus {

    $messageSubject: Subject<any> = new Subject();

    $message = this.$messageSubject.asObservable();

    subscribers = {};

    subscribeToChannel(channel: MessageChannels) {
        return this.$message.pipe(
            filter((v => v.channel === channel)),
            map(v => v.data)
        )
    }

    publishData(data: MessageData) {
        this.$messageSubject.next(data);
    }
};

export const MBus = new MessageBus();