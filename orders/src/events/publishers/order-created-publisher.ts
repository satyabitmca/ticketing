import { Publisher, OrderCreatedEvent, Subjects } from "@satyabitmca/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

