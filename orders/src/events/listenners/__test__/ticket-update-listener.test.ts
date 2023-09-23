import { TicketUpdatedEvent } from "@deathknight666/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/Ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
    const listner = new TicketUpdatedListener(natsWrapper.client);


    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });

    await ticket.save();

    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: 'new concert',
        price: 30,
        userId: 'testada',
        version: ticket.version + 1
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {
        listner,
        data,
        msg,
        ticket,
    };
};

it("finds, update and saves a ticket", async () => {
    const { data, listner, msg, ticket } = await setup();

    await listner.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);


    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);


});


it("acks the msg", async () => {
    const { data, listner, msg, ticket } = await setup();

    await listner.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();

});


it("does not call ack if the event is not in the right order", async () => {
    const { data, listner, msg, ticket } = await setup();

    data.version = 10;
    try {
        await listner.onMessage(data, msg);

    } catch (error) {
    }

    expect(msg.ack).not.toHaveBeenCalled();
});
