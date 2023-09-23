import supertest from "supertest";
import { app } from "../../../app";
import { Ticket } from "../../../models/Ticket";
import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@deathknight666/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listner = new TicketCreatedListener(natsWrapper.client);

    const id = new mongoose.Types.ObjectId().toHexString();
    const userId = new mongoose.Types.ObjectId().toHexString();

    const data: TicketCreatedEvent['data'] = {
        id,
        title: 'concert',
        price: 20,
        version: 0,
        userId,
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {
        listner,
        data,
        msg,
    };
};

it("creates and save a ticekt", async () => {
    const { data, listner, msg } = await setup();

    await listner.onMessage(data, msg);

    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);

});


it("acks the msg", async () => {
    const { data, listner, msg } = await setup();

    await listner.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();

});