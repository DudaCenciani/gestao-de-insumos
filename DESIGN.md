---
name: Gestão de Insumos MR
colors:
  surface: '#fff7fc'
  surface-dim: '#e6d4ea'
  surface-bright: '#fff7fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#feefff'
  surface-container: '#fae8fe'
  surface-container-high: '#f4e2f8'
  surface-container-highest: '#eeddf2'
  on-surface: '#221827'
  on-surface-variant: '#5b3f44'
  inverse-surface: '#372c3c'
  inverse-on-surface: '#fcebff'
  outline: '#8f6f74'
  outline-variant: '#e3bdc3'
  surface-tint: '#bc004f'
  primary: '#b7004d'
  on-primary: '#ffffff'
  primary-container: '#e01e64'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb1bf'
  secondary: '#943894'
  on-secondary: '#ffffff'
  secondary-container: '#ff96f8'
  on-secondary-container: '#7d227e'
  tertiary: '#704e87'
  on-tertiary: '#ffffff'
  tertiary-container: '#8a67a1'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9de'
  primary-fixed-dim: '#ffb1bf'
  on-primary-fixed: '#3f0016'
  on-primary-fixed-variant: '#90003b'
  secondary-fixed: '#ffd6f7'
  secondary-fixed-dim: '#ffaaf7'
  on-secondary-fixed: '#37003a'
  on-secondary-fixed-variant: '#781c7a'
  tertiary-fixed: '#f3daff'
  tertiary-fixed-dim: '#e0b8f8'
  on-tertiary-fixed: '#2b0b41'
  on-tertiary-fixed-variant: '#593970'
  background: '#fff7fc'
  on-background: '#221827'
  surface-variant: '#eeddf2'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system embodies a modern, precise, and refined aesthetic tailored for internal logistics, material requisition, and inventory governance. Moving away from utilitarian industrial software clichés, this system marries structured operational utility with a clean, delicate, and feminine palette that conveys clarity, poise, and high-efficiency control.

Key design attributes:
- **Tone:** Methodical, sharp, yet tactfully soft and approachable.
- **Visual Style:** Modern Light-Minimal with Tonal Layering. It leverages translucent lilacs, crisp high-contrast actions, and structural geometric typography for data headers, offset by ultra-legible utilitarian bodies for intensive tabular readouts.
- **User Experience Intent:** Reduce administrative cognitive fatigue during rapid requisition scanning, approval loops, and inventory auditing via immediate status hierarchy and breathable, well-paced layouts.

## Colors

The system uses a balanced hierarchy centered on vivid focal points, soft environmental backdrops, and strict status categorizations for operational compliance:

- **Primary (`#F73474`):** Primary action triggers, key conversions, active tab indicators, and critical highlights.
- **Secondary (`#8C308C`):** High-level section headings, sidebar navigation active treatments, and structural container accents.
- **Tertiary (`#795790`):** Sub-headers, secondary operational buttons, table column headers, and auxiliary icons.
- **Lilac Soft Ground (`#EDE3FE`):** Card canvas backdrops, muted section containers, alternating table zebra fills, and input inactive states.
- **Delicate Rose (`#FFBED0`):** Soft focus rings, subtle badges, decorative edge boundaries, and selection indicator fills.
- **Functional Status Tokens:**
  - *Pendente:* Background `#FEF3C7`, Text `#92400E`, Border `#FCD34D` (Amber).
  - *Aprovada:* Background `#E0F2FE`, Text `#075985`, Border `#7DD3FC` (Cyan-Blue).
  - *Entregue:* Background `#DCFCE7`, Text `#166534`, Border `#86EFAC` (Emerald-Green).
  - *Recusada:* Background `#FEE2E2`, Text `#991B1B`, Border `#FCA5A5` (Crimson-Red).
- **Base Surfaces & Neutral Texts:**
  - Base App Canvas: `#FAFAFD`
  - Elevated Container Surface: `#FFFFFF`
  - High-Contrast Text: `#1E1423`
  - Medium-Contrast Body: `#504455`
  - Subtle Dividing Lines: `#E6DCF5`

## Typography

The type scale combines technical modernism with ergonomic operational clarity.

- **Display & Section Titles:** Handled by a geometric display sans (`Space Grotesk`) to project crisp structural alignment, technical forwardness, and identity presence without impeding comprehension. Use all-caps sparingly only on ultra-short module identifiers.
- **Tabular Data, Forms, and Metrics:** Entrusted to `Inter` for unmatched glyph clarity in high-density inventory data, numerical alignment, SKU reading, and continuous scanning.
- **Hierarchy Rules:**
  - Screen headers and major inventory KPI numbers use `display-lg` or `headline-lg`.
  - Requisition lists, card headers, and interactive field groups use `headline-md` and `headline-sm`.
  - Data grid items, audit records, and descriptive specs use `body-md` and `body-sm`.
  - Metadata badges and table sort heads strictly utilize `label-sm` with slight uppercase tracking.

## Layout & Spacing

A 12-column responsive layout anchors the administrative viewport, transitioning cleanly to a 4-column stack on mobile devices.

- **Viewport Fluidity & Margins:**
  - Mobile (< 768px): Single column or 4-column grid with `margin: 1rem` (16px) and `gutter: 1rem`. Tables scroll horizontally inside constrained wrappers.
  - Tablet (768px – 1024px): 8-column layout with `margin-tablet: 1.5rem` and dual-pane panel support.
  - Desktop (> 1024px): 12-column fixed or fluid grid with `margin-desktop: 2rem` and `gutter-desktop: 1.5rem`, preserving a permanent 260px vertical navigation rail.
- **Component Flow:**
  - Compact operational inputs use `space-sm` for horizontal padding and `space-xs` between labels and controls.
  - Inventory card structures use `space-md` inner padding, separating card groups with `space-lg`.

## Elevation & Depth

This system avoids heavy, muddy drop shadows, relying instead on clean tonal layers, crisp micro-borders, and soft lilac-tinted ambiance to maintain a lightweight, clinical feel:

- **Flat Level (Level 0):** Background canvas `#FAFAFD` sits at the bottom layer.
- **Surface Level (Level 1):** Main data tables, panels, and standard requisition cards utilize `#FFFFFF` backed by a 1px solid border in `#EDE3FE`.
- **Soft Hover / Floating (Level 2):** Dropdown menus, modal sheets, and active cards sit atop an ambient tinted drop shadow: `0 4px 20px -2px rgba(121, 87, 144, 0.08), 0 2px 6px -1px rgba(140, 48, 140, 0.04)`.
- **Dialogues & Popovers (Level 3):** Modal overlays apply a translucent lilac veil (`rgba(30, 20, 35, 0.35)`) and feature an elevated container with `0 12px 32px -4px rgba(140, 48, 140, 0.16)`.

## Shapes

The interface balances precision-engineered data grids with humanized softness:

- **Base Components (`0.5rem` / 8px):** Applied to form textfields, numeric steppers, standard buttons, data table wrappers, and item cards.
- **Status Pills & Chips (`9999px`):** All lifecycle badges (`Pendente`, `Aprovada`, `Entregue`, `Recusada`) and filter chips employ full pill radius to cleanly separate operational states from tabular rectilinearity.
- **Modal Sheets & Slide-outs (`1rem` / 16px):** Outer window corners on dialogs and requisition detail trays use relaxed curves to ground layered transitions.

## Components

### Buttons
- **Primary:** Solid `#F73474` background, `#FFFFFF` bold text, radius `0.5rem`. Hover triggers `#DF2060`; active press drops slightly (`transform: scale(0.98)`).
- **Secondary:** Transparent background with a 1.5px solid `#8C308C` border, `#8C308C` text. Hover fills `#EDE3FE` at 40% opacity.
- **Ghost / Utility:** `#795790` text without outline; hover renders `#EDE3FE`.

### Status Badges (Strict Compliance)
All badges are styled as compact pills (`0.75rem` vertical, `label-sm` font, 1px perimeter border):
- **Pendente:** Background `#FEF3C7`, Text `#92400E`, Border `#FCD34D`.
- **Aprovada:** Background `#E0F2FE`, Text `#075985`, Border `#7DD3FC`.
- **Entregue:** Background `#DCFCE7`, Text `#166534`, Border `#86EFAC`.
- **Recusada:** Background `#FEE2E2`, Text `#991B1B`, Border `#FCA5A5`.

### Input Fields & Controls
- **Textfields & Selects:** Height `40px`, background `#FFFFFF`, border `1px solid #EDE3FE`, text `#1E1423`, border-radius `0.5rem`.
- **Focus State:** 2px outline in `#F73474` with an accompanying `#FFBED0` glow ring (`box-shadow: 0 0 0 3px #FFBED0`).
- **Checkboxes & Radios:** Accent color `#F73474`, border `#795790`, inner check in white.

### Data Tables & Cards
- **Tables:** Embedded inside `#FFFFFF` cards with `#EDE3FE` outer borders. Headers feature `#795790` text on `#FAFAFD` background with a subtle bottom divider. Table rows alternate with an optional `#EDE3FE` tint (opacity 25%) on hover.
- **Requisition Summary Cards:** Crisp `#FFFFFF` surface with a subtle left accent rail (3px solid `#8C308C` or `#F73474` according to requisition urgency).

### Numeric Inventory Stepper
- Unified pill container (`#EDE3FE`) housing increment and decrement icon actions around an editable numeric text cell, preventing manual typo risks during quick material requisitions.