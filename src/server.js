import express from 'express';
import { router } from './routes.js';

const app = express();

const viewsPath = new URL('./views', import.meta.url).pathname;
console.log('viewsPath :>> ', viewsPath);
app.set('views', viewsPath);
app.set('view engine', 'ejs');

app.use('/', router);

const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
