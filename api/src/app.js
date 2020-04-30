import * as Sentry from '@sentry/node';
import Youch from 'youch';

import express from 'express';
import 'express-async-errors';

import routes from './routes';
import path from 'path';

import sentryConfig from './config/sentry';

import './database';

class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
        this.exceptionHandler();

        Sentry.init(sentryConfig);
    }

    middlewares() {
        this.server.use(express.json());
        this.server.use(
            '/files',
            express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
        );
    }

    routes() {
        this.server.use(routes);
    }

    exceptionHandler() {
        this.server.use(async (err, req, res, next) => {
            const errors = await new Youch(err, req).toJSON();

            return res.status(500).json(errors);
        });
    }
}

export default new App().server;
