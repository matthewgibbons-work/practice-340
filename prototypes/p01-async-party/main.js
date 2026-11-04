// My S02 party. Add 'missingno' to see the others still load when one fails.
const startingNames = ['pikachu', 'bulbasaur', 'squirtle'];
const MAX_PARTY_SIZE = 6;

const form = document.querySelector('#add-form');
const input = document.querySelector('#pokemon-name');
const addButton = form.querySelector('button');
const status = document.querySelector('#status');
const list = document.querySelector('#party');

// The party as plain data: { name, sprite, types }. The page is drawn from it.
let party = [];

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// Fetches one Pokémon and keeps only what the page needs.
// Throws for a wrong name (404) or any other bad answer; fetch itself
// throws if there's no connection at all.
const fetchPokemon = async (name) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (response.status === 404) {
    throw new Error(`There's no Pokémon called "${name}".`);
  }
  if (!response.ok) {
    throw new Error(`PokéAPI had a problem (status ${response.status}).`);
  }
  const data = await response.json();
  return {
    name: data.name,
    sprite: data.sprites.front_default,
    types: data.types.map((entry) => entry.type.name),
  };
};

// One card: name, sprite (if PokéAPI has one), and types.
const makeCard = (pokemon) => {
  const item = document.createElement('li');

  const heading = document.createElement('h3');
  heading.textContent = capitalize(pokemon.name);
  item.append(heading);

  if (pokemon.sprite) {
    const sprite = document.createElement('img');
    sprite.src = pokemon.sprite;
    sprite.alt = `${capitalize(pokemon.name)}, front view`;
    item.append(sprite);
  }

  const types = document.createElement('p');
  types.className = 'types';
  types.textContent = `Type: ${pokemon.types.join(', ')}`;
  item.append(types);

  return item;
};

const render = () => {
  list.replaceChildren(...party.map(makeCard));
};

// Loads the starting party. Every fetch starts at once. allSettled waits for
// all of them and reports each one, so one failure doesn't throw away the rest.
const loadStartingParty = async () => {
  status.textContent = 'Loading your party…';
  const results = await Promise.allSettled(startingNames.map(fetchPokemon));

  party = results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value);
  const failed = startingNames.filter((name, i) => results[i].status === 'rejected');
  render();

  if (failed.length === 0) {
    status.textContent = `Your party of ${party.length} is ready.`;
  } else if (party.length === 0) {
    status.textContent = "Your party couldn't load. Check your connection and reload the page.";
  } else {
    status.textContent = `Loaded ${party.length} Pokémon. Couldn't load: ${failed.join(', ')}.`;
  }
};

// Adds one Pokémon by name from the form.
const addPokemon = async (event) => {
  event.preventDefault();
  const name = input.value.trim().toLowerCase();

  if (name === '') {
    status.textContent = 'Type a Pokémon name first.';
    return;
  }
  if (party.length >= MAX_PARTY_SIZE) {
    status.textContent = `Your party is full: it can hold ${MAX_PARTY_SIZE} Pokémon.`;
    return;
  }
  if (party.some((member) => member.name === name)) {
    status.textContent = `${capitalize(name)} is already in your party.`;
    return;
  }

  // Disabled while the request is out, so a double press can't add it twice.
  addButton.disabled = true;
  status.textContent = `Looking up ${name}…`;
  try {
    const pokemon = await fetchPokemon(name);
    party = [...party, pokemon];
    render();
    status.textContent = `${capitalize(pokemon.name)} joined your party.`;
    input.value = '';
  } catch (error) {
    // fetch throws a TypeError only when it can't reach the server at all.
    status.textContent =
      error instanceof TypeError
        ? "Couldn't reach PokéAPI. Check your connection and try again."
        : error.message.startsWith("There's no Pokémon")
          ? `${error.message} Check the spelling and try again.`
          : `${error.message} Try again in a minute.`;
  } finally {
    addButton.disabled = false;
    input.focus();
  }
};

form.addEventListener('submit', addPokemon);
loadStartingParty();
