import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@satyabitmca/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession(
    {
        signed: false,
        secure: process.env.NODE_ENV !=='test'    }
    ));

app.use(currentUser);
app.use(createChargeRouter);

app.all('*', async(req, res) => {
    throw new NotFoundError();
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    errorHandler(err, req, res, next);
});


export { app }