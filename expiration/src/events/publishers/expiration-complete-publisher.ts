import { ExpirationCompleteEvent, Publisher, Subjects } from "@deathknight666/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete;
}