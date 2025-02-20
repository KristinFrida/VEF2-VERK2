// routes.js
import express from 'express';
import { getDatabase } from './lib/db.client.js';
import { environment } from './lib/environment.js';
import { logger } from './lib/logger.js';

export const router = express.Router();

router.get('/', async (req, res) => {
  const db = getDatabase();
  const result = await db?.query('SELECT * FROM categories ORDER BY created DESC');
  const categories = result?.rows ?? [];

  res.render('index', { title: 'Forsíða', categories });
});

router.get('/spurningar/:category', async (req, res) => {
  const db = getDatabase();
  const categoryName = req.params.category;

  // Sækjum upplýsingar um spurningar og svör fyrir gefinn flokk
  const query = `
    SELECT c.name AS category_name,
           s.id AS spurning_id,
           s.spurning AS spurning,
           JSON_AGG(JSON_BUILD_OBJECT('id', sv.id, 'text', sv.svor_text, 'correct', sv.correct)) AS svor
    FROM categories c
    JOIN spurningar s ON s.category_id = c.id
    LEFT JOIN svor sv ON s.id = sv.spurning_id
    WHERE c.name = $1
    GROUP BY c.name, s.id, s.spurning
    ORDER BY s.created DESC
  `;
  const result = await db?.query(query, [categoryName]);
  const spurningar = result?.rows ?? [];

  res.render('category', {
    title: `Spurningar í „${categoryName}“`,
    categoryName,
    spurningar,
  });
});

router.get('/form', async (req, res) => {
  const db = getDatabase();
  const result = await db?.query('SELECT * FROM categories ORDER BY created DESC');
  const categories = result?.rows ?? [];

  res.render('form', { title: 'Búa til spurningu', categories });
});

// POST /form
router.post('/form', async (req, res) => {
  const env = environment(process.env, logger);
  if (!env) {
    process.exit(1);
  }
  const db = getDatabase();

  const {
    name,
    text,
    option1,
    option2,
    option3,
    option4,
    rett_svar,
  } = req.body;

  await db.query(`
    INSERT INTO categories (name)
    VALUES ($1)
    ON CONFLICT (name) DO NOTHING
  `, [name]);

  const catIdResult = await db.query('SELECT id FROM categories WHERE name = $1', [name]);
  const categoryId = catIdResult.rows[0].id;

  const spurningResult = await db.query(`
    INSERT INTO spurningar (spurning, category_id)
    VALUES ($1, $2)
    RETURNING id
  `, [text, categoryId]);
  const spurningId = spurningResult.rows[0].id;

  const answers = [option1, option2, option3, option4];
  for (let i = 0; i < answers.length; i++) {
    const svarText = answers[i];
    const isCorrect = (String(i + 1) === rett_svar);
    await db.query(`
      INSERT INTO svor (svor_text, spurning_id, correct)
      VALUES ($1, $2, $3)
    `, [svarText, spurningId, isCorrect]);
  }

  // endum á að senda notanda á spurningar í "name" flokknum
  res.redirect(`/spurningar/${name}`);
});

// 404 handler — kemur á *eftir* öllum route
router.use((req, res) => {
  // Ef ekkert í router gekk upp, sendum 404:
  res.status(404).render('not-found');
});
