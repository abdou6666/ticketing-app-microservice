import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: any;


jest.mock('../nats-wrapper');
process.env.STRIPE_KEY = 'sk_test_51NtqfPAmZ5l0OqhCSPBYpJvEfrCca3JJXpXRnsfeBFC273Oaf6V4j0CzEN0m1i5HHrPR9sLv4ffVZ4Wlf9eovZ3100Anj6ETHp';

beforeAll(async () => {
    process.env.JWT_SECRET_KEY = 'asdfasdf';

    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});


beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

declare global {
    var signin: (id?: string) => string[];
}

global.signin = (id?: string) => {
    // Build JWT Payload {id, email}
    const userId = id || new mongoose.Types.ObjectId().toHexString();

    const payload = {
        id: userId,
        email: "test@test.com"
    };

    // create JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!);

    // Build Session object

    const session = { jwt: token };

    // turn session into JSON
    const sessionJSON = JSON.stringify(session);
    // take json and encode it as BASE64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string thats the cookie with JWT
    return [`session=${base64}`];

};