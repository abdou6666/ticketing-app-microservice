import { Subjects, PaymentCreatedEvent, Listener, OrderStatus } from "@deathknight666/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/Order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const { id, orderId, stripeId } = data;

        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error('order not found');
        }

        order.set({
            status: OrderStatus.Complete
        });

        await order.save();


        msg.ack();
    }


}