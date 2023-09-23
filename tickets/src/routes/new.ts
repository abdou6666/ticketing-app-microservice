import { requireAuth } from "@deathknight666/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/Ticket";
import { TickerCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";
const router = express.Router();

router.post('/api/tickets', requireAuth, [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Pric!e must be greater than 0')
], async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    });

    await ticket.save();

    new TickerCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
    });
    return res.status(201).send(ticket);
});

export { router as createTicketRouter };
