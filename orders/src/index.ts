
import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listenners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listenners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listenners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listenners/payment-created-listener';

const PORT = 3000;
const start = async () => {
    try {
        console.log('orders service started');
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('jwt secret env variable missing');
        }
        if (!process.env.MONGO_DB_URI) {
            throw new Error('MongoDB URI missing');
        }
        if (!process.env.NATS_CLIENT_ID) {
            throw new Error('NATS CLIENT ID missing');
        }
        if (!process.env.NATS_URL) {
            throw new Error('NATS URI missing');
        }
        if (!process.env.NATS_CLUSTER_ID) {
            throw new Error('NATS CLUSTER ID missing');
        }

        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );

        natsWrapper.client.on('close', () => {
            console.log('Nats connection closed');
            process.exit();
        });

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('connect to MongoDB (tickets)');
    } catch (err) {
        console.log(err);
    }

    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    });
};

start();