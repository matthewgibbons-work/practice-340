import { describe, it, expect } from 'vitest';
import { findWeakSpots } from './weakness.js';

// A small made-up type chart: never calls the API.
const relations = {
  electric: ['ground'],
  steel: ['fighting', 'ground', 'fire'],
  water: ['electric', 'grass'],
  fire: ['water', 'ground', 'rock'],
};

describe('findWeakSpots', () => {
  it('finds an attack type that hits two or more members', () => {
    const members = [
      { nickname: 'Pikachu', types: ['electric'] },
      { nickname: 'Jolteon', types: ['electric'] },
    ];
    expect(findWeakSpots(members, relations)).toEqual([
      { attackType: 'ground', hit: ['Pikachu', 'Jolteon'] },
    ]);
  });

  it('leaves out attack types that hit only one member', () => {
    const members = [
      { nickname: 'Pikachu', types: ['electric'] },
      { nickname: 'Squirtle', types: ['water'] },
    ];
    expect(findWeakSpots(members, relations)).toEqual([]);
  });

  it('counts a two-type member once, even when both its types are weak to the same attack', () => {
    const members = [
      { nickname: 'Magnemite', types: ['electric', 'steel'] },
      { nickname: 'Pikachu', types: ['electric'] },
    ];
    expect(findWeakSpots(members, relations)).toEqual([
      { attackType: 'ground', hit: ['Magnemite', 'Pikachu'] },
    ]);
  });

  it('lists the attack that hits the most members first', () => {
    const members = [
      { nickname: 'Pikachu', types: ['electric'] },
      { nickname: 'Jolteon', types: ['electric'] },
      { nickname: 'Magnemite', types: ['electric', 'steel'] },
      { nickname: 'Charmander', types: ['fire'] },
      { nickname: 'Scizor', types: ['steel'] },
    ];
    const spots = findWeakSpots(members, relations);
    expect(spots[0]).toEqual({
      attackType: 'ground',
      hit: ['Pikachu', 'Jolteon', 'Magnemite', 'Charmander', 'Scizor'],
    });
    // Fighting and fire both hit Magnemite and Scizor (steel), so they tie at two,
    // in the order the team first met them.
    expect(spots.slice(1)).toEqual([
      { attackType: 'fighting', hit: ['Magnemite', 'Scizor'] },
      { attackType: 'fire', hit: ['Magnemite', 'Scizor'] },
    ]);
  });

  it('returns no weak spots for an empty team', () => {
    expect(findWeakSpots([], relations)).toEqual([]);
  });
});
