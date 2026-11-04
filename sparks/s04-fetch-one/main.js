// The Pokémon to look up. Misspell it (try 'pikachuu') to see the error message.
const pokemonName = 'pikachu';

const loading = document.querySelector('#loading');
const errorMessage = document.querySelector('#error');
const card = document.querySelector('#pokemon');

// Builds the card: name, sprite, and a list of types.
const render = (pokemon) => {
  const heading = document.createElement('h2');
  heading.textContent = pokemon.name;

  const sprite = document.createElement('img');
  sprite.src = pokemon.sprites.front_default;
  sprite.alt = `${pokemon.name}, front view`;

  const typesLabel = document.createElement('p');
  typesLabel.textContent = 'Types:';

  const types = document.createElement('ul');
  for (const entry of pokemon.types) {
    const item = document.createElement('li');
    item.textContent = entry.type.name;
    types.append(item);
  }

  card.replaceChildren(heading, sprite, typesLabel, types);
};

const loadPokemon = async () => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    // fetch only throws when the request can't be made at all (offline).
    // A wrong name still comes back, as a 404, so we check ok ourselves.
    if (!response.ok) {
      throw new Error(`No Pokémon called "${pokemonName}" (status ${response.status})`);
    }
    const pokemon = await response.json();
    render(pokemon);
  } catch (error) {
    // A wrong name gets my own message; anything else is the connection.
    errorMessage.textContent = error.message.startsWith('No Pokémon')
      ? `${error.message}. Check the spelling and try again.`
      : "Couldn't reach PokéAPI. Check your connection and reload the page.";
    errorMessage.hidden = false;
  } finally {
    loading.hidden = true;
  }
};

loadPokemon();
