// The one shared team. The .svelte.js ending lets this plain file use $state.
// Every component that imports `team` sees the same object, so when a property
// changes here, every part of the page that reads it updates.
// Only the functions below change it; components call them (through App)
// instead of editing members themselves.
import { whyCantAdd, nicknameError, MAX_NICKNAME_LENGTH } from './rules.js';

export const team = $state({ members: [] });

// Adds a Pokémon ({ id, name, types, sprite }) from PokéAPI.
// Returns null when it was added, or the sentence from the rules saying why not.
export function addMember(pokemon) {
  const reason = whyCantAdd(team.members, pokemon);
  if (reason !== null) {
    return reason;
  }
  team.members.push({
    ...pokemon,
    // Start with the species name as the nickname, cut to fit the rule.
    nickname: capitalize(pokemon.name).slice(0, MAX_NICKNAME_LENGTH),
    role: 'attacker',
  });
  return null;
}

// Saves an edited nickname and role. Returns null, or why it wasn't saved.
export function updateMember(id, { nickname, role }) {
  const reason = nicknameError(nickname);
  if (reason !== null) {
    return reason;
  }
  const member = team.members.find((m) => m.id === id);
  if (member === undefined) {
    return 'That member is no longer on the team.';
  }
  member.nickname = nickname.trim();
  member.role = role;
  return null;
}

export function removeMember(id) {
  team.members = team.members.filter((m) => m.id !== id);
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
