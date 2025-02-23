// app.js
import express from 'express';
import session from 'express-session';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url'
import { environment } from './lib/environment.js';
import { handler404, handlerError } from './lib/handlers.js';
import { logger } from './lib/logger.js';
import { router } from './routes.js';
import { getDatabase } from './lib/db.client.js';
import { isInvalid } from './lib/is-invalid.js';

const env = environment(process.env, logger);
if (!env) {
  process.exit(1);
}
const { port, sessionSecret } = env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sessionOptions = {
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
};

const app = express();

app.set('views', join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.locals = {
  isInvalid,
};

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

const server = app.listen(port, () => {
  console.info(`🚀 Server running at http://localhost:${port}/`);
});

process.on('SIGTERM', async () => {
  logger.info('🛑 shutting down');
  server.close((e) => {
    if (e) {
      logger.error('error closing server', { error: e });
    }
  });
  if (!(await getDatabase()?.close())) {
    logger.error('error closing database connection');
  }
});
