import pg from 'pg';
import { describe, expect, beforeEach, beforeAll, afterAll, afterEach, test, jest } from '@jest/globals';
import { Database, getDatabase } from './db.client.js';

jest.mock('pg', () => {
  const mClient = {
    query: jest.fn(),
    release: jest.fn(),
  };
  const mPool = {
    connect: jest.fn(() => Promise.resolve(mClient)),
    end: jest.fn(() => Promise.resolve()),
    on: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

beforeAll(() => {
  jest.spyOn(process, 'exit').mockImplementation(() => {
    throw new Error('process.exit called');
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  process.env.DATABASE_URL = 'postgres://fake_user:fake_password@localhost:5432/fake_db';
});

describe('Database class', () => {
  let db;

  beforeEach(() => {
    db = new Database('fake_connection_string');
    db.open();
  });

  afterEach(async () => {
    await db.close();
    jest.clearAllMocks();
  });

  test('open initializes the connection pool', () => {
    expect(db.pool).toBeDefined();
    expect(pg.Pool).toHaveBeenCalledWith(expect.any(Object));
  });

  test('close shuts down the pool', async () => {
    const result = await db.close();
    expect(result).toBe(true);
    expect(db.pool).toBeNull();
  });

  test('connect returns a client when the pool is open', async () => {
    const client = await db.connect();
    expect(client).toBeDefined();
  });

  test('connect returns null when pool is not open', async () => {
    await db.close();
    const client = await db.connect();
    expect(client).toBeNull();
  });

  test('query executes a SQL statement', async () => {
    const mockQueryResult = { rows: [{ id: 1, name: 'Test' }] };
    const client = await db.connect();
    client.query.mockResolvedValueOnce(mockQueryResult);

    const result = await db.query('SELECT * FROM test');
    expect(result).toBe(mockQueryResult);
  });

  test('query returns null on error', async () => {
    const client = await db.connect();
    client.query.mockRejectedValueOnce(new Error('Query failed'));

    const result = await db.query('SELECT * FROM test');
    expect(result).toBeNull();
  });
});

describe('getDatabase function', () => {
  test('returns a singleton instance of Database', () => {
    process.env.DATABASE_URL = 'fake_connection_string';
    const instance1 = getDatabase();
    const instance2 = getDatabase();

    expect(instance1).toBe(instance2);
  });

  test('returns null if environment is not set', () => {
    Object.defineProperty(process, 'env', {
      value: {},
      writable: true
    });

    const instance = getDatabase();
    expect(instance).toBeNull();
  });
});
