// app.js
import express from 'express';
import session from 'express-session';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { environment } from './lib/environment.js';
import { handler404, handlerError } from './lib/handlers.js';
import { logger } from './lib/logger.js';
import { router } from './routes.js';
import { formatDate } from './lib/date.js';
import { getDatabase } from './lib/db.js';
import { isInvalid } from './lib/is-invalid.js';

// --- 1) Sækjum config ---
const env = environment(process.env, logger);
if (!env) {
  process.exit(1);
}
const { port, sessionSecret } = env;

// --- 2) Útfærum __dirname í ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- 3) Setjum upp express, session, passport og routes ---
const sessionOptions = {
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
};

const app = express();

// Stillingar á views
app.set('views', join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Setjum global breytur í `app.locals`
app.locals = {
  isInvalid,
  formatDate,
};

// --- 4) Middleware (röð) ---
app.use(express.urlencoded({ extended: true }));

// Bjóðum upp á static skrár úr src/lib á slóð /js
app.use('/js', express.static(join(__dirname, 'src/lib')));

// Setjum upp session
app.use(session(sessionOptions));

// Setjum upp routes
app.use('/', router);

// 404-handler (ekki inline) – ef engin route fannst
app.use(handler404);

// 5xx villu-handler
app.use(handlerError);

// --- 5) Keyrum server ---
const server = app.listen(port, () => {
  console.info(`🚀 Server running at http://localhost:${port}/`);
});

// --- 6) Graceful shutdown á SIGTERM ---
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
