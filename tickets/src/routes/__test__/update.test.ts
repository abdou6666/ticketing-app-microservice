import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/Ticket";


it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'title',
            price: 20
        })
        .expect(404);
});
it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'title',
            price: 20
        })
        .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', global.signin())
        .send({
            title: 'title',
            price: 20
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'updated title',
            price: 30
        })
        .expect(401);
});

it('returns a 400 if the user povides an invalid title or price', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: 'title',
            price: 20
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            price: 30
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'valid title'
        })
        .expect(400);
});
it('updates the ticket provided valid input', async () => {
    const cookie = global.signin();


    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: 'title',
            price: 20
        })
        .expect(201);

    const ticktResponse = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'new title',
            price: 30
        })
        .expect(201);

    expect(ticktResponse.body.title).toEqual("new title");
    expect(ticktResponse.body.price).toEqual(30);
});

it('publishs an event', async () => {

    const cookie = global.signin();


    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: 'title',
            price: 20
        })
        .expect(201);

    const ticktResponse = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'new title',
            price: 30
        })
        .expect(201);

    expect(natsWrapper.client.publish).toBeCalled();

});


it("rejects an update if a ticket is reserverd", async () => {
    const cookie = global.signin();


    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: 'title',
            price: 20
        })
        .expect(201);

    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
    await ticket!.save();

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 30
        })
        .expect(400);

});