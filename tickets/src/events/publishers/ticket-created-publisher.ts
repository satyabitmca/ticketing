import { Publisher, Subjects, TicketCreatedEvent } from "@satyabitmca/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
   readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
