import { requireAuth } from "@deathknight666/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/Ticket";
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
    return res.status(201).send(ticket);
});

export { router as createTicketRouter };
