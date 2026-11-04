// The stat card's working-out. Each function takes PokéAPI data and returns
// something to show. Nothing here touches the page, so Vitest can test it all.
//
// PokéAPI's `stats` is an array like:
//   [{ base_stat: 35, stat: { name: 'hp' } }, { base_stat: 55, stat: { name: 'attack' } }, ...]

// Adds up every base stat.
export const statTotal = (stats) => stats.reduce((sum, entry) => sum + entry.base_stat, 0);

// The name(s) of the highest stat. An array, because two stats can tie.
export const strongestStats = (stats) => {
  const highest = Math.max(...stats.map((entry) => entry.base_stat));
  return stats.filter((entry) => entry.base_stat === highest).map((entry) => entry.stat.name);
};

// 'special-attack' → 'Special Attack', 'hp' → 'HP', 'mr-mime' → 'Mr Mime'.
export const readableName = (name) =>
  name
    .split('-')
    .map((word) => (word === 'hp' ? 'HP' : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ');
