// The page: it keeps the party, draws it, and asks party.js whether each change is allowed.
import { addPokemon, levelUp, removePokemon } from './party.js';

let party = [
  { name: 'Pikachu', type: 'electric', level: 12 },
  { name: 'Bulbasaur', type: 'grass', level: 9 },
  { name: 'Squirtle', type: 'water', level: 99 },
];

// Pokémon waiting to join. Pikachu is here on purpose, to try the duplicate rule.
const bench = [
  { name: 'Charmander', type: 'fire', level: 8 },
  { name: 'Eevee', type: 'normal', level: 15 },
  { name: 'Jigglypuff', type: 'fairy', level: 11 },
  { name: 'Snorlax', type: 'normal', level: 30 },
  { name: 'Pikachu', type: 'electric', level: 5 },
];

const list = document.querySelector('#party');
const benchList = document.querySelector('#bench');
const heading = document.querySelector('#party-heading');
const status = document.querySelector('#status');

const makeButton = (text, onClick) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
};

const makeName = (pokemon) => {
  const name = document.createElement('span');
  name.className = 'name';
  name.textContent = `${pokemon.name} (${pokemon.type}), level ${pokemon.level}`;
  return name;
};

const makePartyItem = (pokemon, index) => {
  const item = document.createElement('li');
  const up = makeButton(`Level up ${pokemon.name}`, () => {
    party = levelUp(party, index);
    render();
    status.textContent = `${pokemon.name} is level ${party[index].level}.`;
    list.children[index].querySelector('button').focus();
  });
  const remove = makeButton(`Remove ${pokemon.name}`, () => {
    party = removePokemon(party, index);
    render();
    status.textContent = `${pokemon.name} left the party.`;
    focusAfterRemove(index);
  });
  item.append(makeName(pokemon), up, remove);
  return item;
};

const makeBenchItem = (pokemon) => {
  const item = document.createElement('li');
  const add = makeButton(`Add ${pokemon.name}`, () => {
    const result = addPokemon(party, pokemon);
    if (result.ok) {
      party = result.party;
      render();
      status.textContent = `${pokemon.name} joined the party.`;
    } else {
      status.textContent = result.reason;
    }
  });
  item.append(makeName(pokemon), add);
  return item;
};

const render = () => {
  list.replaceChildren(...party.map(makePartyItem));
  if (party.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'Your party is empty.';
    list.append(empty);
  }
  benchList.replaceChildren(...bench.map(makeBenchItem));
};

// From my S02 TODO(human): focus goes to the item that slid into the removed
// one's place, or the one above it, or the heading if the party is empty.
const focusAfterRemove = (removedIndex) => {
  if (party.length === 0) {
    heading.focus();
    return;
  }
  const next = Math.min(removedIndex, party.length - 1);
  const buttons = list.children[next].querySelectorAll('button');
  buttons[buttons.length - 1].focus();
};

render();
