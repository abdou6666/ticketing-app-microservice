import request from "supertest";
import { app } from "../../app";

const createTicket = () => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'concert',
            price: 20
        });
};

it('can fetch all tickets ', async () => {
    const createTicketsPromises = [1, 2, 3].map(el => createTicket());
    await Promise.all(createTicketsPromises);

    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200);

    expect(response.body.length).toEqual(3);
});
