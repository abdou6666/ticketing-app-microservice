import { PaymentCreatedEvent, Publisher, Subjects } from "@deathknight666/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
}