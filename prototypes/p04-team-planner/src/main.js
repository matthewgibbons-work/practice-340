// Starts the Svelte app: mount() draws App into the empty <div id="app">.
import { mount } from 'svelte';
import App from './App.svelte';

mount(App, { target: document.querySelector('#app') });
