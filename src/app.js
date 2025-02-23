// netlify-app.js
import dotenv from 'dotenv';
dotenv.config(); // Loads .env variables for local development

import express from 'express';
import session from 'express-session';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import serverless from 'serverless-http';
import { environment } from './lib/environment.js';
import { handler404, handlerError } from './lib/handlers.js';
import { logger } from './lib/logger.js';
import { router } from './routes.js';
import { isInvalid } from './lib/is-invalid.js';

// Get environment configuration; ensure SESSION_SECRET is set
const env = environment(process.env, logger);
if (!env) {
  process.exit(1);
}
const { port, sessionSecret } = env; // Note: 'port' is used locally only

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sessionOptions = {
  secret: sessionSecret, // Make sure SESSION_SECRET is defined in Netlify's Environment Variables
  resave: false,
  saveUninitialized: false,
};

const app = express();

// Set views and view engine
app.set('views', join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.locals = { isInvalid };

// Set a default Content-Type header
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(session(sessionOptions));

app.use('/', router);
app.use(express.static(join(__dirname, '../public')));

app.use(handler404);
app.use(handlerError);

// If running locally, you might want to start the server
if (process.env.LOCAL_DEV) {
  app.listen(port, () => {
    console.info(`🚀 Server running at http://localhost:${port}/`);
  });
}

// Export the handler for Netlify
export const handler = serverless(app);
