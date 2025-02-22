import pg from 'pg';
import { describe, expect, beforeAll, afterAll, beforeEach, afterEach, test, jest } from '@jest/globals';
import { categoriesFromDatabase, query } from './db.js';

beforeAll(() => {
  jest.spyOn(process, 'exit').mockImplementation((code) => {
    throw new Error(`process.exit called with ${code}`);
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  process.env.DATABASE_URL = 'postgres://fake_user:fake_password@localhost:5432/fake_db';
});

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

describe('Database functions', () => {
  let mockPool;
  let mockClient;

  beforeEach(async () => {
    mockPool = new pg.Pool();
    mockClient = await mockPool.connect();
    mockClient.query.mockClear();
    mockClient.release.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('categoriesFromDatabase returns categories on success', async () => {
    const mockData = { rowCount: 2, rows: [{ id: 1, name: 'Test' }, { id: 2, name: 'Another' }] };
    mockClient.query.mockResolvedValueOnce(mockData);

    const result = await categoriesFromDatabase();
    expect(result).toEqual(mockData.rows);
    expect(mockClient.query).toHaveBeenCalledWith('SELECT * FROM categories');
    expect(mockClient.release).toHaveBeenCalled();
  });

  test('categoriesFromDatabase returns null when no data is found', async () => {
    mockClient.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

    const result = await categoriesFromDatabase();
    expect(result).toBeNull();
    expect(mockClient.query).toHaveBeenCalledWith('SELECT * FROM categories');
    expect(mockClient.release).toHaveBeenCalled();
  });

  test('query executes given SQL and returns result', async () => {
    const mockQuery = 'SELECT * FROM test';
    const mockData = { rowCount: 1, rows: [{ id: 1, name: 'Example' }] };
    mockClient.query.mockResolvedValueOnce(mockData);

    const result = await query(mockQuery);
    expect(result).toEqual(mockData);
    expect(mockClient.query).toHaveBeenCalledWith(mockQuery, []);
    expect(mockClient.release).toHaveBeenCalled();
  });

  test('query handles connection error', async () => {
    mockPool.connect.mockRejectedValueOnce(new Error('Connection error'));

    const result = await query('SELECT * FROM test');
    expect(result).toBeUndefined();
  });

  test('query handles query execution error', async () => {
    mockClient.query.mockRejectedValueOnce(new Error('Query failed'));

    const result = await query('SELECT * FROM test');
    expect(result).toBeNull();
    expect(mockClient.release).toHaveBeenCalled();
  });
});