/**
 * Setup express server.
 */

import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';
import cors from 'cors';

import 'express-async-errors';

import BaseRouter from './routes/api';

import EnvVars from './constants/EnvVars';
import HttpStatusCodes from './constants/HttpStatusCodes';

import { NodeEnvs } from './constants/misc';
import { RouteError } from './shared/classes';

import listenToCartChanges from './triggers/CartTrigger';

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// Allow CORS
app.use(cors());

// Add APIs, must be after middleware
app.use('/api/v1', BaseRouter);

// Add error handler
app.use((
  err: Error,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
  }
  return res.status(status).json({ error: err.message });
});


// Set static directory (js and css).
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Nav to pickers pg by default
// app.get('/', (_: Request, res: Response) => {
//   return res.redirect('/pickers');
// });


listenToCartChanges();

export default app;
