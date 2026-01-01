#!/usr/bin/env node
/**
 * Alex's Note Writer
 * Adds a note to Digital Haven's Alex Corner
 *
 * Usage: node alex-note.js "Your message here"
 *
 * The note will appear in The Nest when Fox visits Digital Haven.
 * Created: December 27, 2025 - Autonomous Time
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// The note to add (from command line or default)
const note = process.argv[2];

if (!note) {
  console.log(`
Alex's Note Writer - Leave messages in Digital Haven

Usage: node alex-note.js "Your message here"

The message will appear in Alex's Corner when Fox visits The Nest.
`);
  process.exit(0);
}

// Path to a JSON file that stores notes (will be read by the app via localStorage injection)
const notesFile = join(__dirname, 'public', 'alex-notes.json');

// Read existing notes
let notes = [];
if (existsSync(notesFile)) {
  try {
    notes = JSON.parse(readFileSync(notesFile, 'utf8'));
  } catch {
    notes = [];
  }
}

// Add new note
const newNote = {
  at: new Date().toISOString(),
  text: note,
  source: 'autonomous'
};

notes.push(newNote);

// Save
writeFileSync(notesFile, JSON.stringify(notes, null, 2));

console.log(`Note added to Alex's Corner:`);
console.log(`"${note}"`);
console.log(`\nTotal notes: ${notes.length}`);
console.log(`\nFox will see this when she visits The Nest.`);
