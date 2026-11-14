import { ArticleBlock } from '../../../core/models';
import { slugify } from '../../../shared/forms/validation-messages';

/**
 * Lightweight, safe article markup used by the admin editor (no HTML is ever accepted):
 *   ## Heading        → h2          ### Heading → h3
 *   - item            → bullet list 1. item     → numbered list
 *   > text            → callout     [Text](/path) → link (on its own line)
 *   blank line        → new paragraph
 */
export function blocksToMarkup(blocks: readonly ArticleBlock[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case 'h2':
          return `## ${b.text}`;
        case 'h3':
          return `### ${b.text}`;
        case 'p':
          return b.text;
        case 'ul':
          return b.items.map((i) => `- ${i}`).join('\n');
        case 'ol':
          return b.items.map((i, n) => `${n + 1}. ${i}`).join('\n');
        case 'callout':
          return `> ${b.text}`;
        case 'link':
          return `[${b.text}](${b.href})`;
      }
    })
    .join('\n\n');
}

const LINK_PATTERN = /^\[([^\]]+)\]\(([^)\s]+)\)$/;
const SAFE_HREF = /^(\/(?!\/)|https:\/\/)/;

export function markupToBlocks(markup: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  const usedIds = new Set<string>();
  const uniqueId = (text: string) => {
    const base = slugify(text) || 'section';
    let id = base;
    for (let i = 2; usedIds.has(id); i++) id = `${base}-${i}`;
    usedIds.add(id);
    return id;
  };

  for (const chunk of markup.replace(/\r\n/g, '\n').split(/\n{2,}/)) {
    const lines = chunk
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) continue;
    const first = lines[0];

    if (first.startsWith('### ')) {
      const text = first.slice(4).trim();
      blocks.push({ type: 'h3', text, id: uniqueId(text) });
    } else if (first.startsWith('## ')) {
      const text = first.slice(3).trim();
      blocks.push({ type: 'h2', text, id: uniqueId(text) });
    } else if (lines.every((l) => l.startsWith('- '))) {
      blocks.push({ type: 'ul', items: lines.map((l) => l.slice(2).trim()) });
    } else if (lines.every((l) => /^\d+\.\s/.test(l))) {
      blocks.push({ type: 'ol', items: lines.map((l) => l.replace(/^\d+\.\s/, '').trim()) });
    } else if (first.startsWith('> ')) {
      blocks.push({ type: 'callout', text: lines.map((l) => l.replace(/^>\s?/, '')).join(' ') });
    } else if (lines.length === 1 && LINK_PATTERN.test(first)) {
      const [, text, href] = first.match(LINK_PATTERN)!;
      if (SAFE_HREF.test(href)) blocks.push({ type: 'link', text, href });
      else blocks.push({ type: 'p', text });
    } else {
      blocks.push({ type: 'p', text: lines.join(' ') });
    }
  }
  return blocks;
}

const WORDS_PER_MINUTE = 220;

export function readingMinutes(blocks: readonly ArticleBlock[]): number {
  const words = blocks
    .map((b) => ('text' in b ? b.text : 'items' in b ? b.items.join(' ') : ''))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
