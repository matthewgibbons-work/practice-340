// The party, in one place. Every component imports it from here, so there's
// only ever one copy: PartyList, NicknameForm, and TeamSummary all see the same members.
//
// It's a const $state, and nothing reassigns it. A module can't export a $state
// that gets reassigned (Svelte stops the build with state_invalid_export), so the
// functions below change it from the inside: push, splice, and setting a field.

// The starting party. Misspell one (try 'eeveee') to see the error message.
export const STARTING_NAMES = ['pikachu', 'bulbasaur', 'eevee', 'snorlax'];

// Everyone starts at level 5. PokéAPI has no "level", so it's our own data.
const STARTING_LEVEL = 5;
const MAX_LEVEL = 100;

// Longest nickname the form accepts (it fits on a card at 200% zoom).
export const MAX_NICKNAME = 12;

export const party = $state([]);

// Fetches one Pokémon and keeps only what the page shows.
async function fetchPokemon(name) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!response.ok) {
    throw new Error(`Couldn't find “${name}”.`);
  }
  const data = await response.json();
  // Capitalize here, not in CSS, so the name a screen reader hears is capitalized too.
  const displayName = data.name[0].toUpperCase() + data.name.slice(1);
  return {
    id: data.id,
    name: displayName,
    nickname: '',
    sprite: data.sprites.front_default,
    level: STARTING_LEVEL,
  };
}

// Starts every fetch at once; Promise.all rejects as soon as one fails.
// push, not party = …, so the exported party stays the same array.
export async function loadParty(names) {
  const members = await Promise.all(names.map(fetchPokemon));
  party.length = 0;
  party.push(...members);
}

// What to call a member everywhere on the page: the nickname if there is one.
export function displayName(member) {
  return member.nickname || member.name;
}

export function rename(id, nickname) {
  const member = party.find((m) => m.id === id);
  if (member) member.nickname = nickname;
}

// Returns the removed member's index, so PartyList knows where focus goes next.
export function remove(id) {
  const index = party.findIndex((m) => m.id === id);
  if (index !== -1) party.splice(index, 1);
  return index;
}

export function levelUp(id) {
  const member = party.find((m) => m.id === id);
  if (member && member.level < MAX_LEVEL) member.level += 1;
}
