import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as fontAwesome from '@fortawesome/free-solid-svg-icons';

/**
 * Icons are only used by the docs, they are read from the packages at build time and never ship with the framework,
 * which only provides empty slots (.form-checkbox-check-icon, .form-select-icon, .button-icon, .loading-icon, ...).
 *
 * - Font Awesome Free solid icons: https://fontawesome.com, icons are CC BY 4.0
 * - Lucide: https://lucide.dev, ISC license
 */
export type IconSet = 'fontawesome' | 'lucide';
export type IconName = 'check' | 'chevron-down' | 'clipboard' | 'close' | 'spinner';

export const iconSetLabels: Record<IconSet, string> = {
  fontawesome: 'Font Awesome Free',
  lucide: 'Lucide',
};

const faIcons: Record<IconName, { icon: [number, number, unknown, unknown, string] }> = {
  check: fontAwesome.faCheck as never,
  'chevron-down': fontAwesome.faChevronDown as never,
  clipboard: fontAwesome.faClipboard as never,
  close: fontAwesome.faXmark as never,
  spinner: fontAwesome.faSpinner as never,
};

// The build runs from docs/
// Lucide has no 'spinner' and no 'close', its equivalents are 'loader-circle' and 'x'
const lucideFiles: Partial<Record<IconName, string>> = { spinner: 'loader-circle', close: 'x' };
const lucideDir = resolve(process.cwd(), 'node_modules/lucide-static/icons');

/** Returns an inline `<svg>` sized to the text, `fixedWidth` mirrors Font Awesome's fa-fw */
export const icon = (set: IconSet, name: IconName, className = ''): string => {
  const cls = className ? ` class="${className}"` : '';
  if (set === 'fontawesome') {
    const [width, height, , , path] = faIcons[name].icon;
    return `<svg${cls} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="1.25em" height="1em" fill="currentColor" aria-hidden="true"><path d="${path}"/></svg>`;
  }
  const body = readFileSync(resolve(lucideDir, `${lucideFiles[name] ?? name}.svg`), 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '')
    .match(/<svg[^>]*>([\s\S]*)<\/svg>/)![1]
    .replace(/\s+/g, ' ')
    .trim();
  return `<svg${cls} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.25em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
};
