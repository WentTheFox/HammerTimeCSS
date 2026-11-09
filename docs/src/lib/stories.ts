import { icon, iconSetLabels, type IconSet } from './icons';

export interface Story {
  id: string;
  title: string;
  description: string;
  html: string;
  /** Markup pitfalls shown next to the story, trusted HTML */
  notes?: string[];
}

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
const ucfirst = (value: string) => value[0].toUpperCase() + value.slice(1);

const alerts = `<div class="alert info">
  <div class="alert-icon">i</div>
  <div class="alert-content">
    <div class="alert-title">Info alert</div>
    <div class="alert-text">${lorem}</div>
  </div>
</div>
<div class="alert warning">
  <div class="alert-icon">!</div>
  <div class="alert-content">
    <div class="alert-title">Warning alert</div>
    <div class="alert-text">${lorem}</div>
  </div>
</div>
<div class="alert">
  <div class="alert-content">
    <div class="alert-title">Plain alert</div>
    <div class="alert-text">${lorem}</div>
  </div>
</div>
<div class="alert compact info">
  <div class="alert-content">
    <div class="alert-title">Compact alert title</div>
    <div class="alert-text">Compact alert text</div>
    <div class="alert-actions"><button type="button" class="button"><span class="button-content"><span class="button-text">Compact alert action</span></span></button></div>
  </div>
</div>`;

const loadingIndicator = '<svg class="loading-indicator" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="1em" height="1em"><path d="M35 32a3.001 3.001 0 0 1-6 0l3-26.074L35 32Z" class="minute"/><path d="M35 32a3.001 3.001 0 0 1-6 0l3-13.037L35 32Z" class="hour"/><g class="base"><circle cx="32" cy="32" r="29" class="face"/><path d="M32 3v7m0 44v7m22-29h7M3 32h7" class="ticking"/></g></svg>';

// With `spinner` the loading slot holds the set's spinning icon instead of the clock indicator
const buttonRow = (set: IconSet, spinner = false) => (color?: string) => {
  const loadingContent = spinner ? icon(set, 'spinner', 'docs-spin') : loadingIndicator;
  const cls = color ? `button button-${color}` : 'button';
  const label = color ?? 'default';
  const btn = (extra: string, attrs: string, text: string, loading = false) =>
    `  <button type="button" class="${cls}${extra}"${attrs}>${loading ? `<span class="loading-icon">${loadingContent}</span>` : ''}<span class="button-content"><span class="button-text">${text}</span></span></button>`;
  const iconBtn = (extra: string, attrs: string, loading = false) =>
    `  <button type="button" class="${cls} icon-only${extra}"${attrs} aria-label="${ucfirst(label)} icon-only button">${loading ? `<span class="loading-icon">${loadingContent}</span>` : ''}<span class="button-content"><span class="button-icon">${icon(set, 'clipboard')}</span></span></button>`;
  return `<div class="button-group separated">
${btn('', '', `${ucfirst(label)}`)}
${btn('', ' disabled', 'Disabled')}
${btn(' pressed', '', 'Pressed')}
${btn(' loading', ' disabled', 'Loading', true)}
${iconBtn('', '')}
${iconBtn('', ' disabled')}
${iconBtn(' loading', ' disabled', true)}
</div>`;
};

const buttonsFor = (set: IconSet) => [undefined, 'primary', 'success', 'danger', 'warning', 'light', 'dark'].map(buttonRow(set)).join('\n');

const formFields = (state: 'regular' | 'readonly' | 'disabled', set: IconSet = 'fontawesome', prefix: string = state) => {
  const attr = state === 'regular' ? '' : ` ${state}`;
  return `<div class="form-control-group vertical">
  <div class="form-control-wrap${state === 'disabled' ? ' disabled' : ''}">
    <div class="form-control">
      <label class="form-control-label" for="${prefix}-text">Text input</label>
      <input id="${prefix}-text" class="input-field" type="text" value="Hello"${attr}>
    </div>
  </div>
  <div class="form-control-wrap${state === 'disabled' ? ' disabled' : ''}">
    <div class="form-control">
      <label class="form-control-label" for="${prefix}-select">Select</label>
      <div class="form-control-select">
        <select id="${prefix}-select" class="form-select-input input-field"${attr}>
          <option>First</option>
          <option>Second</option>
        </select>
        <span class="form-select-icon">${icon(set, 'chevron-down')}</span>
      </div>
    </div>
  </div>
  <div class="form-control-wrap${state === 'disabled' ? ' disabled' : ''}">
    <div class="form-control-checkbox">
      <span class="form-checkbox-input-wrap">
        <input id="${prefix}-check" class="form-checkbox-input" type="checkbox" checked${state === 'regular' ? '' : ' disabled'}>
        ${icon(set, 'check', 'form-checkbox-check-icon')}
      </span>
      <label class="form-checkbox-label" for="${prefix}-check">Checkbox</label>
    </div>
  </div>
  <div class="form-control-wrap${state === 'disabled' ? ' disabled' : ''}">
    <div class="form-control-radio">
      <span class="form-radio-input-wrap">
        <input id="${prefix}-radio" class="form-radio-input" type="radio" name="${prefix}-radio" checked${state === 'regular' ? '' : ' disabled'}>
        <span class="form-radio-select-icon"></span>
      </span><label class="form-radio-label" for="${prefix}-radio">Radio</label>
    </div>
  </div>
</div>`;
};

const comboboxItem = (main: string, state = '', addon?: string, mark?: string) => {
  const text = mark ? main.replace(mark, `<mark>${mark}</mark>`) : main;
  return `      <div class="combobox-suggestion-item${state}" role="option">
        <div class="combobox-suggestion-item-label">
          <span class="combobox-suggestion-item-text"><span class="combobox-suggestion-item-main-text">${text}</span></span>${addon ? `
          <span class="combobox-suggestion-item-addon">${addon}</span>` : ''}
        </div>
      </div>`;
};

const combobox = (set: IconSet = 'fontawesome') => `<div class="form-control-group vertical">
  <div class="form-control-wrap">
    <div class="form-control">
      <label class="form-control-label" for="combobox-closed">Closed (select only)</label>
      <div class="form-control-select form-control-combobox full-width">
        <input id="combobox-closed" class="form-select-input input-field" type="text" role="combobox" aria-expanded="false" value="Europe/Warsaw" readonly>
        <span class="form-select-icon">${icon(set, 'chevron-down')}</span>
      </div>
    </div>
  </div>
  <div class="form-control-wrap">
    <div class="form-control">
      <label class="form-control-label" for="combobox-open">Open (typing allowed)</label>
      <div class="form-control-select form-control-combobox allow-typing suggestions-open has-suggestions full-width">
        <input id="combobox-open" class="form-select-input input-field" type="text" role="combobox" aria-expanded="true" value="eu">
        <span class="form-select-icon">${icon(set, 'chevron-down')}</span>
        <div class="combobox-suggestions" role="listbox">
          <div class="combobox-suggestion-header combobox-suggestion-header-overlay">Europe</div>
${comboboxItem('Europe/London', '', 'UTC+0', 'Eu')}
${comboboxItem('Europe/Warsaw', ' selected', 'UTC+1', 'Eu')}
${comboboxItem('Europe/Berlin', ' highlighted', 'UTC+1', 'Eu')}
${comboboxItem('Europe/Helsinki', '', 'UTC+2', 'Eu')}
          <div class="combobox-suggestion-header">Other</div>
${comboboxItem('Africa/Cairo', '', 'UTC+2')}
        </div>
      </div>
    </div>
  </div>
</div>`;

const badgeColors = [undefined, 'green', 'blue', 'cyan', 'purple', 'red', 'yellow', 'muted'];
const badgeGroup = (prefix?: string, suffix?: string) => `<span class="badge-group">
${badgeColors.map(color => {
  const label = `${color ? ucfirst(color) : 'Default'} badge`;
  return `  <span class="badge${color ? ` badge-${color}` : ''}">${prefix ? `<span class="badge-prefix">${prefix}</span>` : ''}<span class="badge-content">${label}</span>${suffix ? `<span class="badge-suffix">${suffix}</span>` : ''}</span>`;
}).join('\n')}
</span>`;


const iconStory = (set: IconSet): Story => ({
  id: `icons-${set}`,
  title: `Icons: ${iconSetLabels[set]}`,
  description: `The framework ships no icons, only empty slots for them: .form-checkbox-check-icon, .form-select-icon, .button-icon and .loading-icon. These demos fill them with ${set === 'fontawesome' ? 'Font Awesome Free solid icons (CC BY 4.0, fontawesome.com)' : 'Lucide icons (ISC, lucide.dev)'}, which are only used by this documentation and are not part of the package. The loading buttons here use the set's spinner icon (${set === 'fontawesome' ? 'spinner' : 'loader-circle'}) rotated by a docs-only animation, the main demos use the clock indicator. Any inline SVG or icon font works.`,
  html: `${formFields('regular', set, `icons-${set}`)}
${buttonRow(set, true)('primary')}`,
});

export const stories: Story[] = [
  { id: 'alerts', title: 'Alerts', description: 'Info and warning variants, plus a compact layout with actions.', html: alerts },
  { id: 'buttons', title: 'Buttons', description: 'Every colour in the default, disabled, pressed and loading state. Icon-only variants (.icon-only with a .button-icon) follow. The loading state puts a .loading-icon (a slot for any icon, here the clock indicator) over the dimmed content, on a gradient in the button colour.', html: buttonsFor('fontawesome'), notes: ["Loading: put a <code class=\"code-span\">.loading-icon</code> element before <code class=\"code-span\">.button-content</code> inside the button. The gradient and the dimming of the content come from it, a button with only <code class=\"code-span\">.loading</code> shows no gradient. It is a slot for any icon or spinner. <code class=\"code-span\">.icon-only</code> buttons put their icon in <code class=\"code-span\">.button-icon</code>."] },
  { id: 'forms-regular', title: 'Forms: regular', description: 'Input, select, checkbox and radio.', html: formFields('regular'), notes: [
    "Icons are slots: the framework ships none. <code class=\"code-span\">.form-checkbox-check-icon</code> and <code class=\"code-span\">.form-select-icon</code> are positioned for a fixed-width icon (about 1.25em wide, 1em tall, such as Font Awesome's <code class=\"code-span\">fa-fw</code>), a text glyph will not line up.",
    "Radio: before v0.1.2 any whitespace between <code class=\"code-span\">.form-radio-input-wrap</code> and <code class=\"code-span\">.form-radio-label</code> pushed the label out. From v0.1.2 the control is a flex row and the markup may be formatted freely.",
  ] },
  { id: 'combobox', title: 'Forms: combobox', description: 'A select-like input with a suggestion list. The framework only styles it: filtering, keyboard handling and toggling the state classes (.suggestions-open, .has-suggestions, .allow-typing, and .selected / .highlighted on items) is up to your script. Both controls here are static; the second one is shown open, with a selected item, a highlighted item, matches wrapped in <mark> and an addon.', html: combobox(), notes: [
    "The suggestion list is absolutely positioned under the control and overlays what follows it, so leave room for it in your layout. Matching items (those containing a <code class=\"code-span\">&lt;mark&gt;</code>) are sorted before the rest.",
    "<code class=\"code-span\">.allow-typing</code> is what makes the input editable-looking: without it the input gets a default cursor and no text selection. Put <code class=\"code-span\">.combobox-suggestion-header-overlay</code> on a header to keep it sticky while the list scrolls.",
    "Addons: <code class=\"code-span\">.addon-mode-dynamic.label-truncated</code> on an item moves the addon into the corner on hover to give a truncated label the full width.",
  ] },
  { id: 'forms-readonly', title: 'Forms: readonly', description: 'The same controls with the readonly attribute.', html: formFields('readonly') },
  { id: 'forms-disabled', title: 'Forms: disabled', description: 'The same controls disabled.', html: formFields('disabled') },
  iconStory('fontawesome'),
  iconStory('lucide'),
  { id: 'badges', title: 'Badges', description: 'Colours, with optional prefix and suffix.', html: [badgeGroup(), badgeGroup('Prefixed'), badgeGroup(undefined, 'Suffixed'), badgeGroup('Prefixed', 'Suffixed')].join('\n') },
  { id: 'table', title: 'Table', description: 'Header, body header cell and footer. Add .responsive to the wrapper to scroll on narrow screens.', html: `<div class="table-wrap">
  <table class="table">
    <thead>
      <tr><th>Table header cell 1</th><th>Table header cell 2</th><th>Table header cell 3</th></tr>
    </thead>
    <tbody>
      <tr><td>Data cell 1 / 1</td><td>Data cell 1 / 2</td><td>Data cell 1 / 3</td></tr>
      <tr><th>Body header cell 2 / 1</th><td>Data cell 2 / 2</td><td>Data cell 2 / 3</td></tr>
    </tbody>
    <tfoot>
      <tr><td>Footer cell 1</td><td>Footer cell 2</td><td>Footer cell 3</td></tr>
    </tfoot>
  </table>
</div>` },
  { id: 'collapsible', title: 'Collapsible', description: 'Styling hooks only: toggle .visible (and set an explicit height) from your own script. This demo toggles it with the button.', html: `<button type="button" class="button" data-demo-toggle="#collapsible-demo"><span class="button-content"><span class="button-text">Toggle visibility</span></span></button>
<div id="collapsible-demo" class="collapsible animate visible">
  <div class="collapsible-inner">
    <p>This is the contents of the collapsible container.</p>
    <p>Visibility is controlled with the <code class="code-span">.visible</code> class.</p>
  </div>
</div>`, notes: ["Details: the CSS reset removes the disclosure marker of <code class=\"code-span\">&lt;summary&gt;</code> (<code class=\"code-span\">list-style: none</code>), so a <code class=\"code-span\">&lt;details&gt;</code> toggle shows no hint that it can be clicked. Give <code class=\"code-span\">&lt;summary&gt;</code> its own affordance, such as a chevron, a border or a pointer cursor (see the &quot;HTML source&quot; toggles on this page). The framework only styles <code class=\"code-span\">.collapsible</code>, it never drives <code class=\"code-span\">.visible</code> for you."] },
  { id: 'card', title: 'Card', description: 'A container with an optional header.', html: `<article class="card">
  <header class="card-header"><h2>Card title</h2></header>
  <p>${lorem}</p>
</article>` },
  { id: 'accordion', title: 'Accordion', description: 'A column of items with a padded body. The framework styles the layout and the body only: the header and the toggling are yours, here native <details> elements are used.', html: `<div class="accordion">
  <details class="accordion-item" open>
    <summary>First item</summary>
    <div class="accordion-item-body">
      <p>${lorem}</p>
      <p>Paragraphs in the body get spacing between them, and links use the content link style: <a href="#accordion">a link</a>.</p>
    </div>
  </details>
  <details class="accordion-item">
    <summary>Second item</summary>
    <div class="accordion-item-body"><p>${lorem}</p></div>
  </details>
</div>`, notes: ["The reset strips the disclosure marker from <code class=\"code-span\">&lt;summary&gt;</code>, see the note on the collapsible story. The <code class=\"code-span\">summary</code> styling in this demo comes from the docs page, not the framework."] },
  { id: 'avatar', title: 'Avatar', description: 'A circular image sized by the --size custom property.', html: `<div class="button-group separated">
${[24, 48, 96].map(size => `  <img class="avatar" style="--size: ${size}px" alt="${size}px avatar" src="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#5865f2"/><circle cx="32" cy="26" r="11" fill="#fff"/><path d="M10 64c2-16 12-22 22-22s20 6 22 22z" fill="#fff"/></svg>')}">`).join('\n')}
</div>` },
];
