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

  res.render('form', { title: 'Búa til spurningu', categories, errors: [], formData: {} });
});

// POST /form með villumeðhöndlun
router.post('/form', async (req, res) => {
  const env = environment(process.env, logger);
  if (!env) {
    process.exit(1);
  }
  const db = getDatabase();
  
  const { name, text, option1, option2, option3, option4, rett_svar } = req.body;
  const errors = [];
  
  // Athugum hvort spurningin uppfylli skilyrðin
  if (!text || text.length < 10 || text.length > 300) {
    errors.push('Spurningin þarf að vera á milli 10 og 300 stafa.');
  }
  
  // Athugum hvort hver svarmöguleiki uppfylli skilyrðin
  const answers = [option1, option2, option3, option4];
  answers.forEach((svar, index) => {
    if (!svar || svar.length < 10 || svar.length > 300) {
      errors.push(`Svarmöguleiki ${index + 1} þarf að vera á milli 10 og 300 stafa.`);
    }
  });
  
  // Athugum hvort rétt svar hafi verið valið
  if (!rett_svar || !['1', '2', '3', '4'].includes(rett_svar)) {
    errors.push('Þú verður að velja rétt svar.');
  }
  
  // Ef einhver villa kemur upp, renderum við formið aftur með villunum
  if (errors.length > 0) {
    const result = await db.query('SELECT * FROM categories ORDER BY created DESC');
    const categories = result?.rows ?? [];
  
    return res.render('form', {
      title: 'Búa til spurningu',
      categories,
      errors,
      formData: { name, text, option1, option2, option3, option4, rett_svar }
    });
  }
  
  // Athuga hvort spurningin er nú þegar til
  const existingQuestion = await db.query('SELECT id FROM spurningar WHERE spurning = $1', [text]);
  if (existingQuestion.rows.length > 0) {
    errors.push('Spurningin er nú þegar til.');
    const result = await db.query('SELECT * FROM categories ORDER BY created DESC');
    const categories = result?.rows ?? [];
    return res.render('form', {
      title: 'Búa til spurningu',
      categories,
      errors,
      formData: { name, text, option1, option2, option3, option4, rett_svar }
    });
  }
  
  // Staðfestum að flokkurinn sé til (ekki bætt við nýjum)
  const catIdResult = await db.query('SELECT id FROM categories WHERE name = $1', [name]);
  if (catIdResult.rows.length === 0) {
    errors.push('Flokkurinn er ekki til. Vinsamlegast veldu gildan flokk.');
    const result = await db.query('SELECT * FROM categories ORDER BY created DESC');
    const categories = result?.rows ?? [];
    return res.render('form', {
      title: 'Búa til spurningu',
      categories,
      errors,
      formData: { name, text, option1, option2, option3, option4, rett_svar }
    });
  }
  const categoryId = catIdResult.rows[0].id;
  
  // Setja inn spurninguna
  const spurningResult = await db.query(
    `INSERT INTO spurningar (spurning, category_id) VALUES ($1, $2) RETURNING id`,
    [text, categoryId]
  );
  const spurningId = spurningResult.rows[0].id;
  
  // Setja inn svörin (leyfir að tvö svör séu eins)
  for (let i = 0; i < answers.length; i++) {
    const svarText = answers[i];
    const isCorrect = (String(i + 1) === rett_svar);
    await db.query(
      `INSERT INTO svor (svor_text, spurning_id, correct) VALUES ($1, $2, $3)`,
      [svarText, spurningId, isCorrect]
    );
  }
  
  // Áframsendum notanda á spurningar í valinn flokk
  res.redirect(`/spurningar/${name}`);
});

// 404 handler
router.use((req, res) => {
  res.status(404).render('not-found');
});
