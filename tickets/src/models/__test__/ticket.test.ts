import { Ticket } from "../ticket";

it('implements optimistic concurrency control', async () => {

    // create an instace of a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    })


    // save the ticket to the database
    await ticket.save();

    // fetch the ticket twice
    const firstInstace = await Ticket.findById(ticket.id);
    const seconInstance = await Ticket.findById(ticket.id);

    // make two seperate changes to the tickets we fetched
    firstInstace?.set({price: 10});
    seconInstance?.set({price: 15});

    // save the first fetched ticket
    await firstInstace?.save();


    // save the second fetched ticket and expect an error
    try {
        await seconInstance?.save();
        
    } catch (error) {
        return ;
    }
    
    throw new Error('should not reach this point');  
});

it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);

});