import { Ticket } from "../Ticket";

it('implements optimistic concurreny control', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: '123'
    });
    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.set('price', 10);
    await firstInstance!.save();

    secondInstance!.set('price', 30);

    // expect(async () => {
    //     await secondInstance!.save();
    // }).toThrow();

    try {
        await secondInstance!.save();
    } catch (error) {
        return;
    }
    throw new Error('Should not reach this point');
});


it('increments the verison on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: '123'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);

});