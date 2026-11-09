import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface Token {
  name: string;
  value: string;
}

export interface TokenGroup {
  id: string;
  title: string;
  tokens: Token[];
}

// The build runs from docs/, the stylesheet is built into the repository root's dist/
const cssPath = resolve(process.cwd(), '../dist/hammertime.css');

/**
 * Reads the `--ht-*` custom properties from the compiled stylesheet, which is the compiled form of the Sass token maps.
 * Declarations are indented by exactly one level inside a top-level rule, the first occurrence is the default value
 * (later ones are breakpoint overrides).
 */
export const getTokenGroups = (): TokenGroup[] => {
  const css = readFileSync(cssPath, 'utf8');
  const seen = new Map<string, string>();
  for (const match of css.matchAll(/^ {2}(--ht-[a-z0-9-]+):\s*(.+?);$/gm)) {
    if (!seen.has(match[1])) seen.set(match[1], match[2]);
  }
  const groups: TokenGroup[] = [
    { id: 'brand', title: 'Brand', tokens: [] },
    { id: 'values', title: 'Values (--ht-value-*)', tokens: [] },
    { id: 'colors', title: 'Colors (--ht-color-*)', tokens: [] },
    { id: 'z-index', title: 'Layering (--ht-z-index-*)', tokens: [] },
  ];
  for (const [name, value] of seen) {
    const group = name.startsWith('--ht-value-') ? 1 : name.startsWith('--ht-color-') ? 2 : name.startsWith('--ht-z-index-') ? 3 : 0;
    groups[group].tokens.push({ name, value });
  }
  return groups.filter((group) => group.tokens.length > 0);
};
