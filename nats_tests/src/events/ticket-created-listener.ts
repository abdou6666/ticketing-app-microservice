import { Message } from "node-nats-streaming";
import Listener from "../../../common/src/events/base-listener";
import { Subjects } from "./subjects";
import { TickerCreatedEvent } from "./ticket-created-event";

class TicketCreatedListener extends Listener<TickerCreatedEvent> {

    readonly subject = Subjects.TicketCreated;

    queueGroupName = 'payement-service';

    onMessage(data: TickerCreatedEvent['data'], msg: Message): void {
        console.log('event data', data);
        msg.ack();
    }
}

export default TicketCreatedListener;