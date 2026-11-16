import { describe, it, expect } from 'vitest';
import { MAX_TEAM_SIZE, whyCantAdd, nicknameError } from './rules.js';

// Makes a pretend member with just the fields the rules look at.
function member(id, name = `mon${id}`) {
  return { id, name };
}

describe('whyCantAdd', () => {
  it('allows an add to an empty team', () => {
    expect(whyCantAdd([], member(25, 'pikachu'))).toBe(null);
  });

  it('allows the sixth member', () => {
    const five = [1, 2, 3, 4, 5].map((id) => member(id));
    expect(whyCantAdd(five, member(6))).toBe(null);
  });

  it('refuses a seventh member', () => {
    const six = [1, 2, 3, 4, 5, 6].map((id) => member(id));
    expect(six).toHaveLength(MAX_TEAM_SIZE);
    expect(whyCantAdd(six, member(7, 'squirtle'))).toBe(
      'The team is full (6 of 6). Remove someone to add squirtle.',
    );
  });

  it('refuses a duplicate', () => {
    expect(whyCantAdd([member(25, 'pikachu')], member(25, 'pikachu'))).toBe(
      'pikachu is already on the team.',
    );
  });

  it('says "full" before "duplicate" when both are true', () => {
    const six = [1, 2, 3, 4, 5, 6].map((id) => member(id));
    expect(whyCantAdd(six, member(1))).toMatch(/full/);
  });
});

describe('nicknameError', () => {
  it('accepts 1 character', () => {
    expect(nicknameError('Z')).toBe(null);
  });

  it('accepts exactly 12 characters', () => {
    expect(nicknameError('abcdefghijkl')).toBe(null);
  });

  it('refuses an empty nickname', () => {
    expect(nicknameError('')).toBe('Give this member a nickname.');
  });

  it('refuses a nickname that is only spaces', () => {
    expect(nicknameError('   ')).toBe('Give this member a nickname.');
  });

  it('refuses 13 characters and says how many', () => {
    expect(nicknameError('abcdefghijklm')).toBe(
      'Nicknames can be at most 12 characters. This one has 13.',
    );
  });

  it('does not count spaces at the ends', () => {
    expect(nicknameError('  Sparky  ')).toBe(null);
  });
});
