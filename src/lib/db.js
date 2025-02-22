import pg from 'pg';
import { environment } from './environment.js';
import { logger as loggerSingleton } from './logger.js';

/**
 * Database class fyrir flokka (categories).
 */
export class CategoryDatabase {
  /**
   * Býr til nýja gagnagrunnstengingu fyrir flokka.
   * @param {string} connectionString Tengistrengur.
   * @param {import('./logger').Logger} logger Sérsniðið logger-kerfi.
   */
  constructor(connectionString, logger) {
    this.connectionString = connectionString;
    this.logger = logger;
    /** @type {pg.Pool | null} */
    this.pool = null;
  }

  /**
   * Opnar tengingar-púll fyrir gagnagrunninn.
   */
  open() {
    this.pool = new pg.Pool({ connectionString: this.connectionString });

    this.pool.on('error', (err) => {
      this.logger.error('Villa í gagnagrunnspúlli', err);
      this.close();
    });
  }

  /**
   * Loka tengingum í gagnagrunnspúllinum.
   * @returns {Promise<boolean>}
   */
  async close() {
    if (!this.pool) {
      this.logger.error('Reynt að loka tengingu sem er ekki opnuð');
      return false;
    }

    try {
      await this.pool.end();
      return true;
    } catch (e) {
      this.logger.error('Villa við að loka tengingarpúlli', { error: e });
      return false;
    } finally {
      this.pool = null;
    }
  }

  /**
   * Tengist gagnagrunninum í gegnum púllinn.
   * @returns {Promise<pg.PoolClient | null>}
   */
  async connect() {
    if (!this.pool) {
      this.logger.error('Reynt að nota gagnagrunn sem ekki er opinn');
      return null;
    }

    try {
      const client = await this.pool.connect();
      return client;
    } catch (e) {
      this.logger.error('Villa við að tengjast gagnagrunni', { error: e });
      return null;
    }
  }

  /**
   * Keyrir SQL fyrirspurn á gagnagrunninum.
   * @param {string} query SQL fyrirspurn.
   * @param {Array<string>} [values=[]] Gildi fyrir fyrirspurnina.
   * @returns {Promise<pg.QueryResult | null>}
   */
  async query(query, values = []) {
    const client = await this.connect();

    if (!client) {
      return null;
    }

    try {
      const result = await client.query(query, values);
      return result;
    } catch (e) {
      this.logger.error('Villa við keyrslu fyrirspurnar', e);
      return null;
    } finally {
      client.release();
    }
  }

  /**
   * Sækir alla flokka úr töflunni "categories".
   * @returns {Promise<Array<Object> | null>}
   */
  async getCategories() {
    const q = 'SELECT * FROM categories';
    const result = await this.query(q);

    if (result && result.rowCount > 0) {
      return result.rows;
    }
    return null;
  }
}

/** Singleton fyrir gagnagrunninn. */
let db = null;

/**
 * Skilar singleton eintakinu af CategoryDatabase.
 * @returns {CategoryDatabase | null}
 */
export function getCategoryDatabase() {
  if (db) {
    return db;
  }

  const env = environment(process.env, loggerSingleton);

  if (!env) {
    return null;
  }

  db = new CategoryDatabase(env.connectionString, loggerSingleton);
  db.open();

  return db;
}
