# @went.tf/hammertime-css

The design of [HammerTime](https://hammertime.cyou) as an extensible, **HTML/CSS-only** framework.
No JavaScript components are included, the stateful components only ship the styling hooks
(`.visible`, `[open]`, `.is-open`, ...) that your own markup or script toggles.

## Usage

```scss
// Plain build with the defaults
@use '@went.tf/hammertime-css';
```

Or use the compiled `dist/hammertime.css`.

### CSS only (no Sass)

`dist/hammertime.css` (and `.min.css`) is the CSS-only build. Everything is controlled with custom properties,
including the brand-derived palette, which is computed at runtime from a single variable:

```html
<link rel="stylesheet" href="@went.tf/hammertime-css/dist/hammertime.css" />
<style>
  :root {
    --ht-brand: #e8590c; /* re-themes header, cards, inputs, primary buttons, links, ... */
    --ht-value-button-border-radius: 0.5rem; /* any value token */
    --ht-color-card-bg-light: #fff; /* any color token, per theme: -light / -dark */
    --ht-value-spacing-2: 0.75em; /* the .m-*, .p-* utilities follow --ht-value-spacing-* */
  }
</style>
```

This build needs CSS relative color syntax (Chrome 119+, Safari 16.4+, Firefox 128+). Browsers without it
should use `dist/hammertime.static.css` (or the Sass build), where the palette is derived at compile time:
the same tokens are still individually overridable, only `--ht-brand` does not exist there.

Token reference:

| Property                                   | Meaning                                                                                            |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `--ht-brand`                               | Brand color the palette is derived from (CSS-only build)                                           |
| `--ht-value-*`                             | Sizes, spacing, radii, typography. Responsive ones have breakpoint overrides inside the stylesheet |
| `--ht-color-*-light` / `--ht-color-*-dark` | Per-theme colors, `--ht-color-*` is the alias that follows the active theme                        |
| `--ht-z-index-*`                           | Layering                                                                                           |

Limits: media query breakpoints (`sm` 400px, `md` 768px, `lg` 1024px, `xl` 1200px, `xxl` 1600px) cannot be CSS
variables, they are set with `$extend-breakpoints` in Sass. To change a responsive value at one breakpoint, override
the property inside your own `@media` rule. To retheme the alias `--ht-color-*` in the dark theme, set the
`-dark` variant, or use a selector as specific as `:root[data-theme="dark"]`.

### Customizing with Sass

Configure the framework **before anything else loads it**:

```scss
@use '@went.tf/hammertime-css' with (
  $brand-color: #e8590c,
  // add or replace tokens, emitted as --ht-value-*, --ht-color-* and --ht-z-index-*
  $extend-values: (
      button-border-radius: 0.5rem,
    ),
  $extend-colors: (
    my-accent: (
      light: #e8590c,
      dark: #ffa94d,
    ),
  )
);
```

The page background gradient is opt-in and off by default (the compiled `dist/` stylesheets do not include it).
Enable it in Sass with `$background-gradient: true`, its colors and layout are the `bg-gradient-*` tokens
(`--ht-color-bg-gradient-*`, `--ht-value-bg-gradient-*`). The middle of the gradient is the brand color. The
start and end follow it too (a hue shift of the brand color), unless you set `$bg-gradient-start` and
`$bg-gradient-end` to fixed colors.

Everything else is a CSS custom property, so it can also be changed at runtime
(`--ht-value-*`, `--ht-color-*-light`/`-dark`). Themes are switched with `data-theme="light|dark"` on `:root`
(defaults to `prefers-color-scheme`), RTL with `dir="rtl"`.

Single components can be used on their own, after configuring `@went.tf/hammertime-css/design`:

```scss
@use '@went.tf/hammertime-css/design' with (
  $brand-color: #e8590c
);
@use '@went.tf/hammertime-css/components/button';
```

## Markup notes

The framework is plain CSS, so some structure is on you:

- **Icons are slots, none are shipped.** `.form-checkbox-check-icon`, `.form-select-icon`, `.button-icon` and
  `.loading-icon` are positioned for a fixed-width icon (about `1.25em` wide, `1em` tall, e.g. an inline SVG
  or Font Awesome's `fa-fw`). A text glyph will not line up.
- **Loading buttons need a `.loading-icon` element** placed before `.button-content` inside the button. The
  gradient and the dimmed content come from it, `.loading` alone shows neither.
- **Radio controls:** before v0.1.2, whitespace between `.form-radio-input-wrap` and `.form-radio-label` pushed
  the label out of line with checkbox labels. From v0.1.2 the control is a flex row and formatting is free.
- **`<summary>` has no marker.** The CSS reset removes the disclosure marker, so give `<details>` toggles their own
  affordance (chevron, border, pointer cursor).

See the [documentation site](https://wentthefox.github.io/HammerTimeCSS/) for rendered examples.

## Status

Extracted from the HammerTime app, work in progress. Documentation and live demo: <https://wentthefox.github.io/HammerTimeCSS/> (source in [`docs/`](docs), an Astro site that is not part of the npm package).

## Releases

Releases are automatic. Commits to `main` follow [Conventional Commits](https://www.conventionalcommits.org/)
(enforced by commitlint, locally through a Husky hook and in CI). On every push to `main` the next
[semantic version](https://semver.org/) is computed from the commits since the last tag:

| Commit                                    | Release |
| ----------------------------------------- | ------- |
| `fix:`                                    | patch   |
| `feat:`                                   | minor   |
| `feat!:` / `BREAKING CHANGE:`             | major   |
| `docs:`, `chore:`, `ci:`, `refactor:` ... | none    |

The package is built and published to npm, then the `vX.Y.Z` tag and a GitHub release with the changelog are created.
`package.json` always says `0.0.0`, the version only lives in the tag.

## License

MIT
