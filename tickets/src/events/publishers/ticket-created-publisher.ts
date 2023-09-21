import { Publisher, Subjects, TickerCreatedEvent } from '@deathknight666/common';

export class TickerCreatedPublisher extends Publisher<TickerCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
}