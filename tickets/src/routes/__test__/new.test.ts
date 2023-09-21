import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";
import { natsWrapper } from "../../nats-wrapper";


it('has a route handler listenning to /api/tikcets for POST requests ', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});

    expect(response.statusCode).not.toEqual(404);
});

it('can only be accessed if the user is signed in ', async () => {
    return await request(app)
        .post('/api/tickets')
        .send({})
        .expect(401);
});
it('return status other than 401 when user is signed in ', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({});

    expect(response.statusCode).not.toEqual(401);
});

it('returns an error if invalid title is provided ', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: 10
        })
        .expect(400);

    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            price: 10
        })
        .expect(400);
});
it('returns an error if invalid price is provided ', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'ticket',
        })
        .expect(400);

    // return request(app)
    //     .post('/api/tickets')
    //     .set('Cookie', global.signin())
    //     .send({
    //         title: 'ticket',
    //         price: -10

    //     })
    //     .expect(400);
});
it('creates a ticket with valid inputs  ', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'ticket',
            price: 20

        })
        .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);


});

it('publishs new event', async () => {

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'ticket',
            price: 20

        })
        .expect(201);

    expect(natsWrapper.client.publish).toBeCalled();

});
