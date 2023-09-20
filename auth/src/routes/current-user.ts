import express, { Request, Response } from 'express';
import { requireAuth, currentUser } from '@deathknight666/common';

const router = express.Router();

router.get('/api/users/current-user', currentUser, requireAuth, (req: Request, res: Response) => {
    const currentUser = req.currentUser || null;
    return res.status(200).json({ currentUser });

});


export { router as currentUserRouter };
