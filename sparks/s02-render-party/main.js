// The party is the data; the page is drawn from it by render().
const party = [
  { name: 'Pikachu', type: 'electric', level: 12 },
  { name: 'Bulbasaur', type: 'grass', level: 9 },
  { name: 'Squirtle', type: 'water', level: 10 },
];

const list = document.querySelector('#party');
const heading = document.querySelector('#party-heading');
const status = document.querySelector('#status');

// Builds one <li> for a party member, with its two buttons.
const makeItem = (pokemon, index) => {
  const item = document.createElement('li');

  const name = document.createElement('span');
  name.className = 'name';
  name.textContent = `${pokemon.name} (${pokemon.type}), level ${pokemon.level}`;

  const levelUp = document.createElement('button');
  levelUp.type = 'button';
  levelUp.textContent = `Level up ${pokemon.name}`;
  levelUp.addEventListener('click', () => {
    party[index].level += 1;
    render();
    status.textContent = `${pokemon.name} is now level ${party[index].level}.`;
    list.children[index].querySelector('button').focus();
  });

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.textContent = `Remove ${pokemon.name}`;
  remove.addEventListener('click', () => {
    party.splice(index, 1);
    render();
    status.textContent = `${pokemon.name} left the party.`;
    focusAfterRemove(index);
  });

  item.append(name, levelUp, remove);
  return item;
};

const render = () => {
  list.replaceChildren(...party.map(makeItem));
  if (party.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'Your party is empty.';
    list.append(empty);
  }
};

// Written by me (was a TODO(human)): where focus goes after a Remove.
// The item that slid into the removed one's place gets focus, or the one
// above it if I removed the last item, or the heading if the party is empty.
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
