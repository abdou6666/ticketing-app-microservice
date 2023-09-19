import express, { Request, Response } from 'express';
import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '../middlewares/require-auth';

const router = express.Router();

router.get('/api/users/current-user', currentUser, requireAuth, (req: Request, res: Response) => {
    const currentUser = req.currentUser || null;
    console.log('current user api');
    return res.status(200).json({ currentUser });

});


export { router as currentUserRouter };
