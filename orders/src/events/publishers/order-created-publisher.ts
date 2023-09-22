import { Publisher, OrderCreatedEvent, Subjects } from "@deathknight666/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}