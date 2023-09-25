
import mongoose from 'mongoose';
import { app } from './app';

const PORT = 3000;
const start = async () => {
    try {
        console.log('Starting...');

        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('jwt secret env variable missing');
        }
        if (!process.env.MONGO_DB_URI) {
            throw new Error('MongoDB URI missing');
        }

        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('connect to MongoDB (auth)');
    } catch (err) {
        console.log(err);
    }

    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    });
};

start();