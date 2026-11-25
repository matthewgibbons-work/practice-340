// The notes collection: the course loader reads every NOTES.md, and this schema
// stops the build if a note is missing its title or has an empty section.
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { notesLoader } from './notes-loader.js';

// A missing heading arrives as undefined (caught by `error`); an empty one as '' (caught by min).
const section = (name) => {
  const message = `The "${name}" section is empty or missing. Write it before you build.`;
  return z.string({ error: message }).min(1, message);
};

const notes = defineCollection({
  loader: notesLoader,
  schema: z.object({
    title: z.string().min(1, 'The title is missing. The first heading should be "# NOTES — <name>".'),
    kind: z.enum(['sparks', 'prototypes']),
    intent: section('Intent'),
    aiUse: section('AI use'),
    decisions: section('Accepted / changed / rejected'),
    digDeeper: section('Dig deeper'),
    openQuestions: section('Open questions'),
  }),
});

export const collections = { notes };
