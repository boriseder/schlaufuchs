// =============================================================
// SCHLAUFUCHS – tests/syntax.test.mjs
// Prüft die syntaktische Validität aller JavaScript-Dateien
// =============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

function getJsFiles(dir) {
  let files = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files = files.concat(getJsFiles(full));
    } else if (full.endsWith('.js')) {
      files.push(full);
    }
  }
  return files;
}

test('Syntax: Alle JavaScript-Dateien in js/ kompilieren fehlerfrei ohne SyntaxError', () => {
  const jsFiles = getJsFiles('js');
  assert.ok(jsFiles.length >= 10, 'Mindestens 10 JS-Dateien müssen vorhanden sein');

  for (const file of jsFiles) {
    const code = readFileSync(file, 'utf8');
    assert.doesNotThrow(() => {
      new vm.Script(code, { filename: file });
    }, `Syntaxfehler in Datei: ${file}`);
  }
});
