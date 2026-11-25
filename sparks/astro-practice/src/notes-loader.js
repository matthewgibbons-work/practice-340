// The DIGHT 340 notes loader (S11). Copy it as it is; your schema and pages do the rest.
// It finds every NOTES.md in your repo's sparks/ and prototypes/ folders, and turns
// each into a collection entry:
//   id: the folder name, like "s02-render-party"
//   data: { title, kind, intent, aiUse, decisions, digDeeper, openQuestions }
//   the whole file, rendered, for <Content />
import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

const SECTIONS = {
  'Intent': 'intent',
  'AI use': 'aiUse',
  'Accepted / changed / rejected': 'decisions',
  'Dig deeper': 'digDeeper',
  'Open questions': 'openQuestions',
};

const parseNotes = (text) => {
  const data = { title: (text.match(/^# NOTES — (.+)$/m)?.[1] ?? '').trim() };
  for (const part of text.split(/^## /m).slice(1)) {
    const [heading, ...lines] = part.split('\n');
    const key = SECTIONS[heading.trim()];
    if (key) data[key] = lines.join('\n').trim();
  }
  return data;
};

// The repo root is the nearest folder above this site that has a sparks/ folder.
const findRepoRoot = async () => {
  let dir = resolve('.');
  while (!(await stat(join(dir, 'sparks')).catch(() => null))) {
    if (dirname(dir) === dir) throw new Error('No sparks/ folder found above this site.');
    dir = dirname(dir);
  }
  return dir;
};

export const notesLoader = {
  name: 'notes-loader',
  load: async ({ store, parseData, renderMarkdown }) => {
    store.clear();
    const root = await findRepoRoot();
    for (const kind of ['sparks', 'prototypes']) {
      const dir = join(root, kind);
      const folders = await readdir(dir).catch(() => []);
      for (const folder of folders) {
        const text = await readFile(join(dir, folder, 'NOTES.md'), 'utf8').catch(() => null);
        if (text === null) continue;
        // parseData checks the entry against your schema, and stops the build if it fails.
        const data = await parseData({ id: folder, data: { ...parseNotes(text), kind } });
        store.set({ id: folder, data, body: text, rendered: await renderMarkdown(text) });
      }
    }
  },
};
