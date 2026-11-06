import { describe, expect, test } from 'vitest';
import { MAX_PARTY_SIZE, whyCantAdd, TYPES, filterByType, readSavedParty } from './party.js';

// Small stand-ins for what the page keeps from PokéAPI (real ids and types).
const pikachu = { id: 25, name: 'Pikachu', types: ['electric'] };
const bulbasaur = { id: 1, name: 'Bulbasaur', types: ['grass', 'poison'] };
const magnemite = { id: 81, name: 'Magnemite', types: ['electric', 'steel'] };
const oddish = { id: 43, name: 'Oddish', types: ['grass', 'poison'] };
const eevee = { id: 133, name: 'Eevee', types: ['normal'] };
const snorlax = { id: 143, name: 'Snorlax', types: ['normal'] };
const jolteon = { id: 135, name: 'Jolteon', types: ['electric'] };

const fullParty = [pikachu, bulbasaur, magnemite, oddish, eevee, snorlax];

describe('whyCantAdd', () => {
  test('allows an add to an empty party', () => {
    expect(whyCantAdd([], pikachu)).toBe(null);
  });

  test('allows a fifth-to-sixth add', () => {
    expect(whyCantAdd(fullParty.slice(0, 5), snorlax)).toBe(null);
  });

  test('stops a seventh member and says the party is full', () => {
    expect(fullParty).toHaveLength(MAX_PARTY_SIZE);
    expect(whyCantAdd(fullParty, jolteon)).toMatch(/full/);
  });

  test('stops a duplicate and names who is already in', () => {
    expect(whyCantAdd([pikachu, eevee], pikachu)).toBe('Pikachu is already in your party.');
  });

  test('says "full" first when a full party gets a duplicate', () => {
    expect(whyCantAdd(fullParty, pikachu)).toMatch(/full/);
  });
});

describe('TYPES', () => {
  test('has all 18 types, each once', () => {
    expect(new Set(TYPES).size).toBe(18);
  });
});

describe('filterByType', () => {
  test("'all' returns the whole party", () => {
    expect(filterByType(fullParty, 'all')).toEqual(fullParty);
  });

  test('keeps members with that type, including dual types', () => {
    expect(filterByType(fullParty, 'electric')).toEqual([pikachu, magnemite]);
  });

  test('returns an empty list when nobody has that type', () => {
    expect(filterByType(fullParty, 'water')).toEqual([]);
  });
});

describe('readSavedParty', () => {
  test('nothing saved gives an empty party, nothing dropped', () => {
    expect(readSavedParty(null)).toEqual({ party: [], dropped: 0 });
  });

  test('reads back what JSON.stringify saved', () => {
    const text = JSON.stringify([pikachu, eevee]);
    expect(readSavedParty(text)).toEqual({ party: [pikachu, eevee], dropped: 0 });
  });

  test('text cut off mid-way gives an empty party instead of throwing', () => {
    expect(readSavedParty('[{"id":25,"name":"Pika')).toEqual({ party: [], dropped: 1 });
  });

  test('JSON that is not a list is dropped', () => {
    expect(readSavedParty('{"members":[]}')).toEqual({ party: [], dropped: 1 });
  });

  test('an older format (just names) is dropped member by member', () => {
    expect(readSavedParty('["pikachu","eevee"]')).toEqual({ party: [], dropped: 2 });
  });

  test('keeps the good members and drops a hand-edited one', () => {
    const text = JSON.stringify([pikachu, { id: 'twenty-five', name: 'Pikachu' }, eevee]);
    expect(readSavedParty(text)).toEqual({ party: [pikachu, eevee], dropped: 1 });
  });

  test('a hand-edited eight-member party is cut back to the rules', () => {
    const text = JSON.stringify([...fullParty, jolteon, pikachu]);
    expect(readSavedParty(text)).toEqual({ party: fullParty, dropped: 2 });
  });
});
