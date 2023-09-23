import { Listener, Subjects, TicketUpdatedEvent } from "@deathknight666/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/Ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findByEvent(data);
        if (!ticket) {
            return new Error('ticket not found');
        }

        const { title, price } = data;
        ticket.set({ title, price });

        await ticket.save();

        msg.ack();
    }

}