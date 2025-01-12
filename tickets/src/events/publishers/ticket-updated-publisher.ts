import { Publisher, Subjects, TicketUpdatedEvent } from "@satyabitmca/common";
import { natsWrapper } from "../../nats-wrapper";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
   readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}


// new TicketUpdatedPublisher(natsWrapper.client).publish({

// });