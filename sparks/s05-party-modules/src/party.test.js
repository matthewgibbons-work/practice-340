import { describe, expect, test } from 'vitest';
import { addPokemon, levelUp, removePokemon, MAX_PARTY_SIZE, MAX_LEVEL } from './party.js';

const pikachu = { name: 'Pikachu', type: 'electric', level: 12 };
const eevee = { name: 'Eevee', type: 'normal', level: 15 };

// Makes a party of `count` different Pokémon.
const partyOf = (count) =>
  Array.from({ length: count }, (_, i) => ({ name: `Mon${i}`, type: 'normal', level: 5 }));

describe('addPokemon', () => {
  test('adds a new Pokémon to the end, without changing the original', () => {
    const party = [pikachu];
    const result = addPokemon(party, eevee);
    expect(result.ok).toBe(true);
    expect(result.party).toEqual([pikachu, eevee]);
    expect(party).toEqual([pikachu]);
  });

  test('edge case: refuses a seventh Pokémon', () => {
    const result = addPokemon(partyOf(MAX_PARTY_SIZE), eevee);
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/full/);
  });

  test('refuses a Pokémon that is already in the party', () => {
    const party = [pikachu, eevee];
    const result = addPokemon(party, { ...pikachu, level: 30 });
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/already/);
    expect(party).toHaveLength(2);
  });
});

describe('levelUp', () => {
  test('raises one Pokémon by one level', () => {
    expect(levelUp([pikachu, eevee], 1)[1].level).toBe(16);
  });

  test('edge case: stops at the maximum level', () => {
    const maxed = { ...pikachu, level: MAX_LEVEL };
    expect(levelUp([maxed], 0)[0].level).toBe(MAX_LEVEL);
  });
});

describe('removePokemon', () => {
  test('removes only the Pokémon at that index', () => {
    expect(removePokemon([pikachu, eevee], 0)).toEqual([eevee]);
  });
});
