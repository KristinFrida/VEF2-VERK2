import { isInvalid } from './is-invalid.js';
import { describe, expect, test } from '@jest/globals';

describe('isInvalid', () => {
  test('returns true if field is in errors', () => {
    const errors = [
      { path: 'email', message: 'Invalid email' },
      { path: 'password', message: 'Password too short' },
    ];
    expect(isInvalid('email', errors)).toBe(true);
    expect(isInvalid('password', errors)).toBe(true);
  });

  test('returns false if field is not in errors', () => {
    const errors = [
      { path: 'email', message: 'Invalid email' },
    ];
    expect(isInvalid('password', errors)).toBe(false);
  });

  test('returns false if errors array is empty', () => {
    expect(isInvalid('email', [])).toBe(false);
  });

  test('returns false if errors is undefined', () => {
    expect(isInvalid('email')).toBe(false);
  });

  test('handles errors with undefined or null elements', () => {
    const errors = [
      { path: 'email', message: 'Invalid email' },
      null,
      undefined,
      { path: 'password', message: 'Password too short' },
    ];
    expect(isInvalid('email', errors)).toBe(true);
    expect(isInvalid('password', errors)).toBe(true);
  });
});
