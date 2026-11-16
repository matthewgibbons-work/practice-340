// Next step: the team's weak spots, as plain counting (no fetch here),
// so Vitest can test it with a small made-up list of types.

// The fewest members one attack type has to hit hard to count as a weak spot.
export const WEAK_SPOT_MIN = 2;

// members: [{ nickname, types: ['electric', 'steel'] }, ...]
// typeRelations: for each defending type, the attack types that do double damage to it,
//   e.g. { electric: ['ground'], steel: ['fighting', 'ground', 'fire'] }
//   (from PokéAPI's /type/{name} → damage_relations.double_damage_from).
// Returns the weak spots, most members hit first:
//   [{ attackType: 'ground', hit: ['Pikachu', 'Jolteon', 'Magnemite'] }, ...]
export function findWeakSpots(members, typeRelations) {
  // For each attack type, the members it hits hard, in team order.
  const hitBy = new Map();
  for (const member of members) {
    // A Set, so a two-type member weak to the same attack twice is only counted once.
    const attacks = new Set(member.types.flatMap((type) => typeRelations[type] ?? []));
    for (const attack of attacks) {
      if (!hitBy.has(attack)) hitBy.set(attack, []);
      hitBy.get(attack).push(member.nickname);
    }
  }
  return [...hitBy]
    .map(([attackType, hit]) => ({ attackType, hit }))
    .filter((spot) => spot.hit.length >= WEAK_SPOT_MIN)
    .sort((a, b) => b.hit.length - a.hit.length);
}
