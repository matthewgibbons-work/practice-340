// The team rules, kept out of the components so Vitest can test them.
// A member looks like { id, name, nickname, role, types, sprite }.
// Each rule returns null when things are fine, or a sentence saying what's wrong,
// so the page can show (and announce) exactly that sentence.

export const MAX_TEAM_SIZE = 6;
export const MAX_NICKNAME_LENGTH = 12;

// The jobs a member can have on the team, for the role radio buttons.
export const ROLES = ['attacker', 'defender', 'support'];

// Checks whether pokemon can join the team.
export function whyCantAdd(members, pokemon) {
  if (members.length >= MAX_TEAM_SIZE) {
    return `The team is full (${MAX_TEAM_SIZE} of ${MAX_TEAM_SIZE}). Remove someone to add ${pokemon.name}.`;
  }
  if (members.some((member) => member.id === pokemon.id)) {
    return `${pokemon.name} is already on the team.`;
  }
  return null;
}

// Checks a nickname. Spaces at the ends don't count toward the length.
export function nicknameError(nickname) {
  const trimmed = nickname.trim();
  if (trimmed.length === 0) {
    return 'Give this member a nickname.';
  }
  if (trimmed.length > MAX_NICKNAME_LENGTH) {
    return `Nicknames can be at most ${MAX_NICKNAME_LENGTH} characters. This one has ${trimmed.length}.`;
  }
  return null;
}
