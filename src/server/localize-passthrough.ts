/**
 * Content modules use $localize. The Express entry (sitemap, robots) runs outside the localized
 * app bundles, so it gets this passthrough that returns the source text: the sitemap only reads
 * slugs and dates. Must be the first import of server.ts.
 */
const stripMeta = (part: string) =>
  part.startsWith(':') ? part.slice(part.indexOf(':', 1) + 1) : part;

const passthrough = (strings: TemplateStringsArray, ...values: readonly unknown[]): string =>
  strings.reduce((text, part, i) => text + (i ? String(values[i - 1]) : '') + stripMeta(part), '');

(globalThis as { $localize?: unknown }).$localize ??= passthrough;
