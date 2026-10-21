import { party } from '../party.js';

const list = document.querySelector('#party');
for (const name of party.map((p) => p.name)) {
  const li = document.createElement('li');
  li.textContent = name;
  list.append(li);
}
