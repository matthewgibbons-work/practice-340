// The party's rules. Every function takes the party (an array) and returns a
// result; none of them change the array they're given or touch the page.

export const MAX_PARTY_SIZE = 6;
export const MAX_LEVEL = 100;

// Tries to add a Pokémon. Returns { ok: true, party } with a new array,
// or { ok: false, reason } saying which rule stopped it.
export const addPokemon = (party, pokemon) => {
  if (party.length >= MAX_PARTY_SIZE) {
    return { ok: false, reason: `Your party is full: it can hold ${MAX_PARTY_SIZE} Pokémon.` };
  }
  if (party.some((member) => member.name === pokemon.name)) {
    return { ok: false, reason: `${pokemon.name} is already in your party.` };
  }
  return { ok: true, party: [...party, pokemon] };
};

// Returns a new party with one Pokémon a level higher, stopping at MAX_LEVEL.
export const levelUp = (party, index) =>
  party.map((member, i) =>
    i === index ? { ...member, level: Math.min(member.level + 1, MAX_LEVEL) } : member,
  );

// Returns a new party without the Pokémon at index.
export const removePokemon = (party, index) => party.filter((member, i) => i !== index);
