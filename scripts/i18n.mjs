#!/usr/bin/env node
/**
 * Translation file tooling for Angular i18n (XLIFF 1.2).
 *
 *   node scripts/i18n.mjs sync    Bring every target file in line with the freshly extracted source
 *                                 file (src/locale/messages.xlf): keeps existing translations, adds
 *                                 new messages without a target, drops messages no longer in the code.
 *   node scripts/i18n.mjs check   Fails (exit 1) when a target file
 *                                   - misses a message, or has an empty target;
 *                                   - has a target identical to the English source, unless the unit is
 *                                     marked state="final" (reviewed: the word really is the same,
 *                                     e.g. "Blog", "Coaching");
 *                                   - uses different placeholders than the source;
 *                                   - contains messages that are no longer used in the code.
 *
 * `npm run i18n` runs extraction + sync; `npm run i18n:check` runs the check.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const SOURCE = 'src/locale/messages.xlf';
const TARGETS = { nl: 'src/locale/messages.nl.xlf' };

const UNIT = /<trans-unit id="([^"]+)"[\s\S]*?<\/trans-unit>/g;
const SOURCE_TEXT = /<source>([\s\S]*?)<\/source>/;
const TARGET_TAG = /<target(?:\s+state="([^"]*)")?>([\s\S]*?)<\/target>/;
const PLACEHOLDER = /<x id="([^"]+)"/g;

/** @returns {Map<string, {block: string, source: string, target: string | null, state: string | null}>} */
function parseUnits(xml) {
  const units = new Map();
  for (const [block, id] of xml.matchAll(UNIT)) {
    const target = block.match(TARGET_TAG);
    units.set(id, {
      block,
      source: block.match(SOURCE_TEXT)?.[1] ?? '',
      target: target ? target[2] : null,
      state: target ? (target[1] ?? null) : null,
    });
  }
  return units;
}

const placeholders = (text) =>
  [...text.matchAll(PLACEHOLDER)]
    .map((m) => m[1])
    .sort()
    .join(',');
const plain = (text) => text.replace(/<x [^>]*\/>/g, '').trim();

function sync() {
  const sourceXml = readFileSync(SOURCE, 'utf8');
  const sourceUnits = parseUnits(sourceXml);
  for (const [locale, file] of Object.entries(TARGETS)) {
    const existing = parseUnits(readFileSync(file, 'utf8'));
    let added = 0;
    let kept = 0;
    const output = sourceXml
      .replace('source-language="en"', `source-language="en" target-language="${locale}"`)
      .replace(UNIT, (block, id) => {
        const previous = existing.get(id);
        if (previous?.target == null) {
          added++;
          return block;
        }
        kept++;
        const state = previous.state ? ` state="${previous.state}"` : '';
        return block.replace(
          SOURCE_TEXT,
          (src) => `${src}\n        <target${state}>${previous.target}</target>`,
        );
      });
    const removed = [...existing.keys()].filter((id) => !sourceUnits.has(id)).length;
    writeFileSync(file, output);
    console.log(
      `${file}: ${kept} kept, ${added} new (need a translation), ${removed} removed (no longer used)`,
    );
  }
}

function check() {
  const sourceUnits = parseUnits(readFileSync(SOURCE, 'utf8'));
  let failures = 0;
  const fail = (file, id, unit, problem) => {
    failures++;
    console.error(`✗ ${file} [${id}] ${problem}\n    "${plain(unit.source).slice(0, 100)}"`);
  };
  for (const file of Object.values(TARGETS)) {
    const units = parseUnits(readFileSync(file, 'utf8'));
    for (const [id, unit] of sourceUnits) {
      const translated = units.get(id);
      if (!translated || translated.target == null) fail(file, id, unit, 'missing translation');
      else if (!plain(translated.target) && plain(unit.source))
        fail(file, id, unit, 'empty target');
      else if (translated.target.trim() === unit.source.trim() && translated.state !== 'final')
        fail(file, id, unit, 'identical to English (mark state="final" if that is intended)');
      else if (placeholders(translated.target) !== placeholders(unit.source))
        fail(file, id, unit, 'placeholders differ from the source');
    }
    for (const [id, unit] of units)
      if (!sourceUnits.has(id)) fail(file, id, unit, 'unused (no longer in the code)');
    console.log(`${file}: ${units.size} messages checked`);
  }
  if (failures) {
    console.error(
      `\n${failures} problem(s). Run "npm run i18n" after changing text, then translate.`,
    );
    process.exit(1);
  }
  console.log(`✓ ${sourceUnits.size} messages, all locales complete`);
}

const command = process.argv[2];
if (command === 'sync') sync();
else if (command === 'check') check();
else {
  console.error('Usage: node scripts/i18n.mjs <sync|check>');
  process.exit(2);
}
