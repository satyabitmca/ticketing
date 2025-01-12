export enum Subjects {
    TicketCreated = 'ticket:created',
    TicketUpdated = 'ticket:updated'
}

const printSubject = (subject: Subjects) => {
    console.log(subject);
};


printSubject(Subjects.TicketCreated);