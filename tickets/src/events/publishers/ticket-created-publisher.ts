import { Publisher, Subjects, TicketCreatedEvent } from '@deathknight666/common';

export class TickerCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
}