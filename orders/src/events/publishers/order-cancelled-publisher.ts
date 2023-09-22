import { OrderCancelledEvent, Publisher, Subjects } from "@deathknight666/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}
