import { describe, expect, test } from 'vitest';
import { statTotal, strongestStats, readableName } from './stats.js';

// Real base stats, copied from https://pokeapi.co/api/v2/pokemon/<name> (Nov 4).
const pikachu = [
  { base_stat: 35, stat: { name: 'hp' } },
  { base_stat: 55, stat: { name: 'attack' } },
  { base_stat: 40, stat: { name: 'defense' } },
  { base_stat: 50, stat: { name: 'special-attack' } },
  { base_stat: 50, stat: { name: 'special-defense' } },
  { base_stat: 90, stat: { name: 'speed' } },
];

const mrMime = [
  { base_stat: 40, stat: { name: 'hp' } },
  { base_stat: 45, stat: { name: 'attack' } },
  { base_stat: 65, stat: { name: 'defense' } },
  { base_stat: 100, stat: { name: 'special-attack' } },
  { base_stat: 120, stat: { name: 'special-defense' } },
  { base_stat: 90, stat: { name: 'speed' } },
];

// Mew: every base stat is 100.
const mew = [
  { base_stat: 100, stat: { name: 'hp' } },
  { base_stat: 100, stat: { name: 'attack' } },
  { base_stat: 100, stat: { name: 'defense' } },
  { base_stat: 100, stat: { name: 'special-attack' } },
  { base_stat: 100, stat: { name: 'special-defense' } },
  { base_stat: 100, stat: { name: 'speed' } },
];

describe('statTotal', () => {
  test("adds up Pikachu's six base stats", () => {
    expect(statTotal(pikachu)).toBe(320);
  });

  test("adds up Mr. Mime's six base stats", () => {
    expect(statTotal(mrMime)).toBe(460);
  });
});

describe('strongestStats', () => {
  test("finds Pikachu's one strongest stat", () => {
    expect(strongestStats(pikachu)).toEqual(['speed']);
  });

  test('keeps every stat when several tie for strongest', () => {
    expect(strongestStats(mew)).toEqual(['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']);
  });
});

describe('readableName', () => {
  test('edge case: turns a hyphenated stat name into words', () => {
    expect(readableName('special-attack')).toBe('Special Attack');
  });

  test('edge case: writes hp as HP', () => {
    expect(readableName('hp')).toBe('HP');
  });

  test('works for a hyphenated Pokémon name too', () => {
    expect(readableName('mr-mime')).toBe('Mr Mime');
  });
});
