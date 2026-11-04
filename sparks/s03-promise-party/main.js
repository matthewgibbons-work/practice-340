// The fake loader from the Async 1 unit page, unchanged: it takes a second,
// and fails for 'missingno'.
const loadPokemon = (name) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (name === 'missingno') reject(new Error(`No Pokémon called ${name}`));
      else resolve({ name });
    }, 1000);
  });

// The names to load. Add 'missingno' to see what a failure looks like.
const names = ['pikachu', 'eevee', 'snorlax'];

const list = document.querySelector('#party');
const status = document.querySelector('#status');

// Draws the party as one <li> per Pokémon.
const render = (party) => {
  list.replaceChildren(
    ...party.map((pokemon) => {
      const item = document.createElement('li');
      item.textContent = pokemon.name;
      return item;
    }),
  );
};

// Starts every load at once, then waits for all of them together.
// If any one fails, Promise.all rejects and we land in catch.
const loadParty = async () => {
  console.time('party');
  try {
    const party = await Promise.all(names.map(loadPokemon));
    render(party);
    status.textContent = `Your party of ${party.length} is ready.`;
  } catch (error) {
    // Clear any half-drawn list, then say what failed in words, not just red text.
    list.replaceChildren();
    status.textContent = `Your party didn't load: ${error.message}. Check the name and try again.`;
  } finally {
    console.timeEnd('party');
  }
};

loadParty();
