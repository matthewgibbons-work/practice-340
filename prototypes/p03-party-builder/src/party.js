// The party rules, kept out of the component so Vitest can test them.
// A party member looks like { id, name, types, sprite }.

export const MAX_PARTY_SIZE = 6;

// Checks whether pokemon can join party.
// Returns null when the add is allowed, or a sentence saying why not,
// so the page can show (and announce) exactly that sentence.
export function whyCantAdd(party, pokemon) {
  if (party.length >= MAX_PARTY_SIZE) {
    return `Your party is full (${MAX_PARTY_SIZE} of ${MAX_PARTY_SIZE}). Remove someone to add ${pokemon.name}.`;
  }
  if (party.some((member) => member.id === pokemon.id)) {
    return `${pokemon.name} is already in your party.`;
  }
  return null;
}

// All 18 types, A–Z, for the filter. A fixed list (not just the types already
// in the party) lets a trainer ask "any water types?" and hear "no".
export const TYPES = [
  'bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost',
  'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water',
];

// The members to show for a filter. 'all' means no filter.
export function filterByType(party, type) {
  if (type === 'all') {
    return party;
  }
  return party.filter((member) => member.types.includes(type));
}

// Beyond: turns the text saved in localStorage back into a party.
// It never throws. Anything it can't use is dropped, and `dropped` says how
// much, so the page can tell the trainer instead of failing silently.
// Written by me: what counts as a member I can trust.
export function readSavedParty(text) {
  if (text === null) {
    return { party: [], dropped: 0 }; // nothing saved yet: a first visit
  }
  let saved;
  try {
    saved = JSON.parse(text);
  } catch {
    return { party: [], dropped: 1 }; // not JSON at all (cut off, hand-edited)
  }
  if (!Array.isArray(saved)) {
    return { party: [], dropped: 1 }; // JSON, but not a list
  }
  const party = [];
  for (const member of saved) {
    const looksRight =
      member !== null &&
      typeof member === 'object' &&
      Number.isInteger(member.id) &&
      typeof member.name === 'string' &&
      Array.isArray(member.types);
    // Run each one through the same rules as a normal add.
    if (looksRight && whyCantAdd(party, member) === null) {
      party.push(member);
    }
  }
  return { party, dropped: saved.length - party.length };
}
