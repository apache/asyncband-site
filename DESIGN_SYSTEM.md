# Asyncband Design System

> **Coordinate tasks. Keep your runtime.** An engineering-grade visual language for Apache Asyncband (Incubating), sharing its structural skeleton with Apache OpenDAL and Apache Reqsign while carrying Asyncband's own identity.

This document defines the visual system for `asyncband-site`. The landing page (`src/pages/index.tsx`) applies the full component vocabulary, while `/downloads`, `/community`, and `/blog` inherit the same tokens through Infima variable projection.

## 1. Skeleton and identity

The system separates structural mechanics from brand identity:

### Shared skeleton (aligned with Apache OpenDAL and Apache Reqsign)

* **Engineering-minimal, light-first, dark-ready**: Light mode is the default, with dark mode designed as a first-class peer through semantic CSS variables.
* **Cool-neutral ink ramp** (`--ab-ink-0` to `--ab-ink-950`): Provides crisp contrast across surfaces, borders, and code windows.
* **Native system font stacks**: Zero third-party font requests, zero layout shift, and strict compliance with the ASF Data Privacy Policy. Monospace (`--ab-font-mono`) acts as a structural voice for eyebrows, Cargo feature names, metrics, and API symbols.
* **4px spacing rhythm and hairline grids**: Sections separate with `1px` borders (`--ab-border`), alternating subtle bands (`--ab-bg-subtle`), and `1px`-gap hairline card matrices.
* **Progressive CSS-only motion**: Micro-interactions stay under 200ms and every animation respects `prefers-reduced-motion`.

### Asyncband identity

* **Resonant Copper** (`--ab-copper-*`): Asyncband's single accent hue, distinct from OpenDAL's precise blue and Reqsign's seal green. `--ab-copper-700` (`#b93815`) serves as the light-mode accent and primary CTA surface (5.76:1 contrast on white). In dark mode, `--ab-copper-300` (`#ff8a61`) handles text/links while primary buttons invert to `--ab-copper-400` (`#ff7340`) with dark ink text (`#0a0d11`, 6.6:1 contrast).
* **The Bauhaus Bass Clef mark** (`static/img/logo.svg`, `static/img/logo-dark.svg`, `static/favicon.svg`): In a musical band, the bass locks independent players into time without acting as a central conductor. A continuous geometric arc paired with two Resonant Copper synchronization dots represents independent async futures coordinating in lockstep without owning an executor.
* **Paired sync-pulse motif** (`.ab-eyebrow::before`): Echoes the two reference dots of the bass clef ahead of uppercase monospace section kickers.

## 2. Where the system lives

| Concern                            | Location                                   |
| ---------------------------------- | ------------------------------------------ |
| Primitive, semantic, Infima tokens | `src/css/custom.css`                       |
| Landing sections                   | `src/components/landing/sections.tsx`      |
| Landing catalog and copy           | `src/components/landing/data.ts`           |
| Tabbed code window                 | `src/components/landing/CodeTabs.tsx`      |
| Scoped landing styles              | `src/components/landing/styles.module.css` |
| Blog layout, list, and TOC rail    | `src/theme/`                               |
| External runtime asset gate        | `scripts/check-external-assets.mjs`        |

## 3. Rules that keep it coherent

* **One accent**: Copper marks interaction, active states, and structural kickers; everything else stays on the ink ramp.
* **Consume semantic tokens only**: Components reference `--ab-bg`, `--ab-surface`, `--ab-fg`, `--ab-accent`, and `--ab-border` rather than raw hex values.
* **Verify every API and count**: Primitive counts and feature counts derive directly from `primitiveGroups` in `src/components/landing/data.ts`, kept in sync with `asyncband` releases.
* **Zero third-party runtime assets**: All styles, scripts, icons, and author avatars resolve locally or inline at build time (`plugins/blog.ts`), enforced in CI by `scripts/check-external-assets.mjs`.
