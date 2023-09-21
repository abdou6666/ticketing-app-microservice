import crypto from 'crypto';
import nats from 'node-nats-streaming';
import TicketCreatedListener from './events/ticket-created-listener';

console.clear();
const stan = nats.connect('ticketing', crypto.randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});



// channel
stan.on('connect', () => {
    console.log('listenner connected to NAT');

    stan.on('close', () => {
        console.log("NATS conneciton closed!");
        process.exit(0);
    });
    new TicketCreatedListener(stan).listen();

});

// TERMINATES process to avoid keeping connection alive when the server down (some events might get requested to this instance while down & cause lag) (work only on linux)

// INTERUPT
process.on('SIGINT', () => stan.close());
// TERMINATE
process.on('SIGTERM', () => stan.close());