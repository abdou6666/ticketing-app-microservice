import { OrderCreatedEvent, OrderStatus } from "@deathknight666/common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/Ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: '123456'
    });

    await ticket.save();

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: '12345',
        expiresAt: '45641',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }

    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};

it("sets the userId of the ticket", async () => {
    const { data, listener, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(data.ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
});

it("calls acks the message", async () => {
    const { data, listener, msg } = await setup();

    await listener.onMessage(data, msg);


    expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
    const { data, listener, msg } = await setup();

    await listener.onMessage(data, msg);


    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(data.id).toEqual(ticketUpdatedData.orderId);
});