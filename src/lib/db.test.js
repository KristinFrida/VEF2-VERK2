import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CategoryDatabase } from './db.js';

describe('CategoryDatabase', () => {
  /** @type {import('./logger').Logger} */
  let mockLogger;

  beforeEach(() => {
    mockLogger = {
      silent: false,
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
  });

  it('Ætti að búa til nýtt CategoryDatabase eintak með réttum connectionString', () => {
    const db = new CategoryDatabase('connectionString', mockLogger);
    expect(db.connectionString).toBe('connectionString');
  });

  it('Ætti að opna tengingar-púll (pool) þegar open() er kallað', () => {
    const db = new CategoryDatabase('connectionString', mockLogger);
    db.open();
    expect(db.pool).not.toBeNull();
  });

  it('Ætti að logga villu og loka tengingarpúll þegar error atburður er sendur', () => {
    const db = new CategoryDatabase('connectionString', mockLogger);
    db.open();
    // Sendum error atburð í gegnum pool
    db.pool.emit('error', 'error');
    expect(mockLogger.error).toHaveBeenCalledWith('Villa í gagnagrunnspúlli', 'error');
  });

  it('Ætti að loka tengingarpúll og setja pool á null þegar close() er kallað', async () => {
    const db = new CategoryDatabase('connectionString', mockLogger);
    db.open();
    // Hér setjum við end() að vera mock-að
    db.pool.end = jest.fn().mockResolvedValue(true);
    const result = await db.close();
    expect(result).toBe(true);
    expect(db.pool).toBeNull();
  });

  it('Ætti að logga villu ef reynt er að loka óopinberum tengingu', async () => {
    const db = new CategoryDatabase('connectionString', mockLogger);
    const result = await db.close();
    expect(result).toBe(false);
    expect(mockLogger.error).toHaveBeenCalledWith('Reynt að loka tengingu sem er ekki opnuð');
  });

  it('Ætti að skila null þegar connect() er kallað ef pool er ekki opinn', async () => {
    const db = new CategoryDatabase('connectionString', mockLogger);
    const client = await db.connect();
    expect(client).toBeNull();
    expect(mockLogger.error).toHaveBeenCalledWith('Reynt að nota gagnagrunn sem ekki er opinn');
  });

  it('Ætti að skila client þegar tengingin er í lagi', async () => {
    const db = new CategoryDatabase('connectionString', mockLogger);
    db.open();
    const mockClient = { query: jest.fn(), release: jest.fn() };
    // Notum mock pool til að prófa connect()
    db.pool = { connect: jest.fn().mockResolvedValue(mockClient), on: jest.fn() };
    const client = await db.connect();
    expect(client).toBe(mockClient);
    expect(db.pool.connect).toHaveBeenCalled();
  });

  it('Ætti að skila null úr query() ef enginn client er til staðar', async () => {
    const db = new CategoryDatabase('connectionString', mockLogger);
    const result = await db.query('SELECT * FROM test');
    expect(result).toBeNull();
  });

  it('Ætti að framkvæma fyrirspurn og skila niðurstöðu þegar client er til staðar', async () => {
    const db = new CategoryDatabase('connectionString', mockLogger);
    db.open();
    const mockQueryResult = { rows: [], rowCount: 0 };
    const mockClient = {
      query: jest.fn().mockResolvedValue(mockQueryResult),
      release: jest.fn(),
    };
    // Skiptum út pool fyrir mock
    db.pool = { connect: jest.fn().mockResolvedValue(mockClient), on: jest.fn() };
    const result = await db.query('SELECT * FROM test');
    expect(result).toEqual(mockQueryResult);
    expect(mockClient.query).toHaveBeenCalledWith('SELECT * FROM test', []);
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('Ætti að skila flokkum ef fyrirspurn í getCategories() skilar röðum', async () => {
    const db = new CategoryDatabase('connectionString', mockLogger);
    db.open();
    const categoriesRows = [{ id: 1, name: 'Category1' }];
    const mockQueryResult = { rows: categoriesRows, rowCount: 1 };
    const mockClient = {
      query: jest.fn().mockResolvedValue(mockQueryResult),
      release: jest.fn(),
    };
    db.pool = { connect: jest.fn().mockResolvedValue(mockClient), on: jest.fn() };
    const categories = await db.getCategories();
    expect(categories).toEqual(categoriesRows);
  });

  it('Ætti að skila null í getCategories() ef engar raðir finnast', async () => {
    const db = new CategoryDatabase('connectionString', mockLogger);
    db.open();
    const mockQueryResult = { rows: [], rowCount: 0 };
    const mockClient = {
      query: jest.fn().mockResolvedValue(mockQueryResult),
      release: jest.fn(),
    };
    db.pool = { connect: jest.fn().mockResolvedValue(mockClient), on: jest.fn() };
    const categories = await db.getCategories();
    expect(categories).toBeNull();
  });
});
