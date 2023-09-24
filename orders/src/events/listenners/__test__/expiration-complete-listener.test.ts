import { ExpirationCompleteEvent } from "@deathknight666/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order, OrderStatus } from "../../../models/Order";
import { Ticket } from "../../../models/Ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'conert',
        price: 20
    });
    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'dajfia',
        expiresAt: new Date(),
        ticket,
    });

    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };
    return {
        order,
        data,
        listener,
        msg,
        ticket,
    };
};

it("updates the order status to cancelled", async () => {
    const { data, listener, msg, order, } = await setup();
    await listener.onMessage(data, msg);

    const udpdatedOrder = await Order.findById(order.id);

    expect(udpdatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
it("emits an OrderCanclled event", async () => {
    const { data, listener, msg, order } = await setup();
    await listener.onMessage(data, msg);


    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(eventData.id).toEqual(order.id);
});
it("ack the message", async () => {
    const { data, listener, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();

});