import { isInvalid } from './is-invalid.js';
import { describe, expect, test } from '@jest/globals';

describe('isInvalid', () => {
  test('skilar true ef reiturinn er til staðar í villulistanum', () => {
    const villur = [
      { path: 'email', message: 'Ógilt netfang' },
      { path: 'password', message: 'Lykilorð of stutt' },
    ];
    expect(isInvalid('email', villur)).toBe(true);
    expect(isInvalid('password', villur)).toBe(true);
  });

  test('skilar false ef reiturinn er ekki til staðar í villulistanum', () => {
    const villur = [
      { path: 'email', message: 'Ógilt netfang' },
    ];
    expect(isInvalid('password', villur)).toBe(false);
  });

  test('skilar false ef villulistanum er tómur', () => {
    expect(isInvalid('email', [])).toBe(false);
  });

  test('skilar false ef villulistan er óskilgreind', () => {
    expect(isInvalid('email')).toBe(false);
  });

  test('meðhöndlar villur með óskilgreindum eða null gildum', () => {
    const villur = [
      { path: 'email', message: 'Ógilt netfang' },
      null,
      undefined,
      { path: 'password', message: 'Lykilorð of stutt' },
    ];
    expect(isInvalid('email', villur)).toBe(true);
    expect(isInvalid('password', villur)).toBe(true);
  });
});
