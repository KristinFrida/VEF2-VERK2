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

// Listen on the port assigned by Render (or fallback to 3000 for local development)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.warn(`Server running on port ${port}`);
});
