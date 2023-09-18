import express, { Request, Response } from 'express';
import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '../middlewares/require-auth';

const router = express.Router();

router.get('/api/users/current-user', currentUser, requireAuth, (req: Request, res: Response) => {
    return res.status(200).json({ currentUser: req.currentUser || null });

});


export { router as currentUserRouter };
