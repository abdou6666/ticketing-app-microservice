import nats, { Message } from 'node-nats-streaming';
import crypto from 'crypto';

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


    // setDeliverAllAvailable re emit all events usefull when service goes down you want to send all the events (to get caught up with other services state) does not work with queue
    // setDeliverAllAvailable very usefull when brining up a service for the first time & needs to catch up

    // setDurableName keep track of which event has been processed and not so we can re emit only the event that hasnt been processed
    // usefull when service temporary goes down & need to catch up on event that has been missed

    // when adding setDurableName &  setDeliverAllAvailable & adding queue the behaviour even if a service goes down temporarly won't it wont dump all durable name

    // setManualAckMode addes ack method on msg u can call it to indicate that u proccessed event correctly

    // if confused just hover on functions
    const options = stan.subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName('order-srv');


    // subscribe(channel,queue-group) queue group uesd to make sure when we scale horizonatilly different instance of the same service dont process
    // the same request multiple times
    const subscription = stan.subscribe('ticket:created',
        'orders-service-queue-group',
        options);

    subscription.on('message', (msg: Message) => {
        const data = msg.getData();
        if (typeof data === 'string') {
            console.log(`Recieved event #${msg.getSequence()}, with data ${data}`);
        }

        msg.ack();
    });

});

// TERMINATES process to avoid keeping connection alive when the server down (some events might get requested to this instance while down & cause lag) (work only on linux)

// INTERUPT
process.on('SIGINT', () => stan.close());
// TERMINATE
process.on('SIGTERM', () => stan.close());