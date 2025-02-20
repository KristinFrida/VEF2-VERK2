import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { environment } from './lib/environment.js';
import { handler404, handlerError } from './lib/handlers.js';
import { logger } from './lib/logger.js';
import { adminRouter } from './routes/admin-routes.js';
import { indexRouter } from './routes/index-routes.js';
import { router } from './routes.js';
import { formatDate } from './lib/date.js';
import { getDatabase } from './lib/db.js';
import { isInvalid } from './lib/is-invalid.js';
import {
  deserializeUser,
  localUserStrategy,
  serializeUser,
} from './lib/users.js';
const env = environment(process.env, logger);

if (!env) {
  process.exit(1);
}


const { port, sessionSecret } = env;
const path = dirname(fileURLToPath(import.meta.url));

const sessionOptions = {
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
};

const app = express();

app.set('views', join(path, '../views'));
app.set('view engine', 'ejs');

app.locals = {
  isInvalid,
  formatDate,
};
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

app.use(express.urlencoded({ extended: true }));
app.use(session(sessionOptions));

passport.use(new Strategy(localUserStrategy));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/', adminRouter);
app.use(express.static(join(path, '../public')));
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
