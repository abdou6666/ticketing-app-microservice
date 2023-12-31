import { BadRequestError, NotFoundError, validateRequest } from '@deathknight666/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Password } from '../services/password';

const router = express.Router();

router.post('/api/users/signin',
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().notEmpty().withMessage('Password must be provided')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            throw new NotFoundError();
        }

        const isValid = await Password.comapre(user.password, password);

        if (!isValid) {
            throw new BadRequestError('Invalid Credentials');
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY!);

        req.session = {
            jwt: token
        };

        return res.status(200).json(user);
    });


export { router as signinRouter };

