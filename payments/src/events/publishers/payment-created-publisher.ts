import { Subjects, Publisher, PaymentCreatedEvent } from "@satyabitmca/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}