
import mongoose from 'mongoose';
import { app } from './app';

const PORT = 3000;
const start = async () => {
    try {

        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('jwt secret env variable missing');
        }

        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
        console.log('connect to MongoDB (auth)');
    } catch (err) {
        console.log(err);
    }

    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    });
};

start();