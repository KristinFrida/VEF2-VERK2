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
  // Hér tökum name = $1 (categoryName)
  // Notum LEFT JOIN til að sækja svör og GROUP BY til að sameina spurningu + svör í eina línu
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

  // Hægt að gera console.log(spurningar) til að sjá niðurstöðuna
  res.render('category', {
    title: `Spurningar í „${categoryName}“`,
    categoryName,
    spurningar,
  });
});

router.get('/form', async (req, res) => {
  // Sækjum flokka til að geta boðið notanda að velja (ef það er tilgangur),
  // en hér er samt form sem býr til nýjan flokk + spurningu, svo kannski þarf þetta ekki.
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

  // Sækjum gögn úr formi
  const {
    name,        // Heiti flokks
    text,        // Spurningin
    option1,
    option2,
    option3,
    option4,
    rett_svar,   // Gildi 1,2,3 eða 4
  } = req.body;

  // 1) Bæta (eða finna) flokk
  //    Ein einföld aðferð er að reyna setja inn og meðhöndla "duplicate key" villu ef hann er til.
  //    Hér notum við ON CONFLICT (name) DO NOTHING og sækjum svo ID með SELECT
  await db.query(`
    INSERT INTO categories (name)
    VALUES ($1)
    ON CONFLICT (name) DO NOTHING
  `, [name]);

  // Náum í ID flokksins
  const catIdResult = await db.query('SELECT id FROM categories WHERE name = $1', [name]);
  const categoryId = catIdResult.rows[0].id;

  // 2) Bæta við nýrri spurningu
  const spurningResult = await db.query(`
    INSERT INTO spurningar (spurning, category_id)
    VALUES ($1, $2)
    RETURNING id
  `, [text, categoryId]);
  const spurningId = spurningResult.rows[0].id;

  // 3) Setja inn svarmöguleika í töflu svor
  //    Setjum inn option1..4 og merkjum þann sem var valinn sem rétt svar.
  const answers = [option1, option2, option3, option4];
  for (let i = 0; i < answers.length; i++) {
    const svarText = answers[i];
    // Athugum hvort i+1 sé það sama og rett_svar
    const isCorrect = (String(i + 1) === rett_svar);

    await db.query(`
      INSERT INTO svor (svor_text, spurning_id, correct)
      VALUES ($1, $2, $3)
    `, [svarText, spurningId, isCorrect]);
  }

  // 4) Velja hvort við birtum staðfestingarsíðu eða förum beint í flokkinn
  //    Hér redirectum við á síðu flokksins sem var nýbúið að búa til/uppfæra
  res.redirect(`/spurningar/${name}`);
});
