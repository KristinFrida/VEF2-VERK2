import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { router } from './routes.js';

const app = express();

app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', router);

const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
