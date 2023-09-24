import { OrderCancelledEvent, OrderStatus } from "@deathknight666/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListner } from "../order-cancelled-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/Order";

const setup = async () => {
    const listener = new OrderCancelledListner(natsWrapper.client);
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        userId: 'adzazda',
        version: 0,
    });
    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: order.version + 1,
        ticket: {
            id: "adad",
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { data, listener, msg, order };
};

it("updates the status of the order", async () => {
    const { data, listener, msg, order } = await setup();
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(data.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
it("acks the message", async () => {
    const { data, listener, msg, order } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});