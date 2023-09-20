import { NotAuthorizedError, NotFoundError, requireAuth } from "@deathknight666/common";
import express, { Request, Response } from "express";
import { Ticket } from "../models/Ticket";
import { body } from "express-validator";
const router = express.Router();

router.put('/api/tickets/:id', requireAuth, [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
], async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        throw new NotFoundError();
    }
    if (ticket.userId !== req.currentUser!.id) {
        console.log(ticket.userId, req?.currentUser?.id);
        throw new NotAuthorizedError();
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price,
    });
    await ticket.save();
    return res.status(200).send(ticket);
});

export { router as updateTicket };

