import { Subjects } from "./subjects";

export interface TickerCreatedEvent {
    subject: Subjects.TicketCreated;
    data: {
        id: string,
        tite: string,
        price: number,
    };
}