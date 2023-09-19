import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/User';
import { Password } from '../services/password';

const router = express.Router();

router.post(
    '/api/users/signup',
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters')
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const { email, password } = req.body;


        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new BadRequestError('Email in use');
        }

        const hashedPassword = await Password.toHash(password);

        const user = User.build({ email, password: hashedPassword });
        await user.save();


        const userJwt = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET_KEY!);

        req.session = {
            jwt: userJwt
        };


        return res.status(201).send(user);

    });
// router.get(
//     '/test',
//     async (req: Request, res: Response) => {
//         const users = await User.find({});

//         return res.status(200).send(users);

//     });

// router.post(
//     '/test',
//     async (req: Request, res: Response) => {
//         const { email, password } = req.body;
//         const user = new User({ email, password });
//         user.save();
//         return res.status(201).send(user);

// });


export { router as signupRouter };

