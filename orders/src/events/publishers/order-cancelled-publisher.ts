import { Subjects, OrderCancelledEvent, Publisher } from "@satyabitmca/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {

    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}