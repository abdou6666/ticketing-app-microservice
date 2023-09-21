import { Publisher, Subjects, TicketUpdatedEvent } from '@deathknight666/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated;
}