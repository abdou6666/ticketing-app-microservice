import { currentUser, errorHandler, NotFoundError } from '@deathknight666/common';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { indexTickets } from './routes/index';
import { createTicketRouter } from './routes/new';
import { showTicket } from './routes/show';
import { updateTicket } from './routes/update';


const app = express();

app.set('trust proxy', true);

app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUser);


app.use(createTicketRouter);
app.use(showTicket);
app.use(indexTickets);
app.use(updateTicket);



app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);


export { app };

