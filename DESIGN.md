---
name: SolarLog
description: Telemetria de usina solar tratada como instrumento aferido — grafite, âmbar, fios de 1px.
colors:
  bg: "#0d0f12"
  panel: "#15181d"
  panel-2: "#1b1f26"
  seam: "#2a2f38"
  ink: "#e8ecf1"
  ink-2: "#9aa3b0"
  ink-3: "#848d9b"
  amber: "#f5a623"
  amber-hi: "#ffcc33"
  amber-dim: "#7a5a1e"
  on: "#36d399"
  off: "#f05252"
typography:
  readout:
    fontFamily: "ui-monospace, 'SF Mono', 'Cascadia Mono', 'Roboto Mono', Menlo, Consolas, monospace"
    fontSize: "clamp(56px, 20vw, 84px)"
    fontWeight: 600
    lineHeight: 0.92
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Archivo, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.12em"
  body:
    fontFamily: "Archivo, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "normal"
  figure:
    fontFamily: "ui-monospace, 'SF Mono', 'Cascadia Mono', 'Roboto Mono', Menlo, Consolas, monospace"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
    fontFeature: "'tnum' 1"
  label:
    fontFamily: "Archivo, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.14em"
rounded:
  sm: "4px"
  control: "10px"
  frame: "16px"
  pill: "999px"
spacing:
  gut: "16px"
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "#1a1205"
    rounded: "{rounded.control}"
    padding: "15px"
  button-primary-hover:
    backgroundColor: "{colors.amber-hi}"
    textColor: "#1a1205"
  button-primary-disabled:
    backgroundColor: "{colors.amber-dim}"
    textColor: "{colors.bg}"
  iconbtn:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.sm}"
    padding: "8px"
  iconbtn-hover:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.ink}"
  input:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "14px"
  card-channel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "16px"
  device-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "16px 2px"
---

# Design System: SolarLog

## Overview

**Creative North Star: "The Calibrated Instrument"**

SolarLog is not a dashboard; it is the readout face of a measuring instrument. The surface reads like the panel of a bench meter: a graphite chassis, a single amber needle, and figures etched in monospace so they look measured rather than styled. Depth is denied — panels are separated by hairline 1px seams, never by stacked cards or drop shadows, so the whole screen reads as one continuous instrument face rather than a deck of widgets.

The palette is almost monochrome by discipline. Graphite greys carry every chrome, label, and container; the amber accent is spent only on live generation data and the active state, so the one warm hue on the screen always means "this is the sun, right now." Green and red are reserved strictly for online/offline truth. The mood is quiet, technical, and trustworthy: the user believes the numbers because they look aferidos, not decorated.

The world is mobile-first and column-bound (max 520px). On wide viewports the column does not float in a black void — it seats into a bordered instrument frame with a single structural shadow, the one deliberate exception to the flat rule.

**Key Characteristics:**
- Graphite chassis, hairline 1px seams instead of cards or shadows
- Amber reserved for live data and active state only
- Monospace tabular figures for every real measurement
- Small-caps tracked labels as the panel-header voice
- Flat by default; one structural shadow for the desktop frame

## Colors

A near-monochrome graphite field with a single amber accent and two status signals.

### Primary
- **Solar Amber** (#f5a623): The one warm hue. Spent only on live generation — the instantaneous-power figure's unit, the chart line/area, per-device power values, active nav, links, focus ring, and the primary button.
- **Amber Hi** (#ffcc33): The brightest reading. The large live-power figure and chart peak/cursor; the primary-button hover.
- **Amber Dim** (#7a5a1e): Muted amber for the history bar-fill gradient origin and the disabled button.

### Neutral
- **Chassis** (#0d0f12): Page background and the app column fill; also the theme-color.
- **Panel** (#15181d): Input and channel-card fill; lighter instrument surface.
- **Panel 2** (#1b1f26): Raised fill — icon-button hover, toast, history bar track, skeleton shimmer.
- **Seam** (#2a2f38): The 1px divider and border hue. The structural line of the whole system.
- **Ink** (#e8ecf1): Primary text and figures.
- **Ink 2** (#9aa3b0): Secondary labels and idle icons.
- **Ink 3** (#848d9b): Tertiary — captions, units, axis text, placeholders, off-state figures.

### Status
- **Online Green** (#36d399): Device/channel online LED and the breathing live indicator.
- **Offline Red** (#f05252): Offline LED, error text, bad-toast accent.

### Named Rules
**The Amber-Is-Sunlight Rule.** Amber (any of its three steps) appears only on live generation data and the active/primary state. If a value is not a live reading and not the one primary action, it is ink, not amber. The accent's scarcity is what makes it legible as "the sun, now."

**The Two-Signal Rule.** Green means online and red means offline — nothing else. Status color is never used decoratively.

## Typography

**Display / Figure Font:** Monospace (ui-monospace → SF Mono → Cascadia Mono → Roboto Mono → Menlo → Consolas)
**Body / Chrome Font:** Archivo (with system-ui fallback)

**Character:** Archivo carries all chrome — marks, labels, headers — in a tracked, uppercase, technical register. Every real measurement is set in monospace with tabular figures (`font-variant-numeric: tabular-nums`, `"tnum" 1`) so digits align in columns and read as instrument output, not typography.

### Hierarchy
- **Readout** (mono, 600, clamp(56px→84px), line-height 0.92, -0.02em): The live instantaneous-power figure. Amber Hi when generating, Ink 3 when off.
- **Title** (Archivo 600, 12px, letter-spacing 0.12em, uppercase): Panel headers ("Curva de hoje"), channel-card headings, detail header.
- **Body** (Archivo 600, 15px, line-height 1.45): Device names and row primary text.
- **Figure** (mono, tabular, 16–19px): Secondary readings — today/total kWh, per-device power, channel metrics, history kWh.
- **Label** (Archivo 600, 11px, letter-spacing 0.14em, uppercase, Ink 3): Small-caps panel labels ("Gerando agora", "Hoje", "Total"), field labels. Nav labels are the same voice at 10px / 0.06em.

### Named Rules
**The Measured-Figure Rule.** Every number that is a real reading is set in the monospace tabular face. Sans-serif is for chrome and prose only; a figure in Archivo would read as decoration, not measurement.

**The Small-Caps Label Rule.** Section and field labels are always uppercase Archivo with wide tracking (0.1em–0.16em), never sentence-case body text.

## Layout

Single column, `max-width: 520px`, centered, `min-height: 100dvh`, with `env(safe-area-inset-*)` padding for installed PWA use. The standard gutter is 16px (`--gut`). Vertical rhythm is set by per-section padding (readout 10/20px, panel 18px, lists 6px with 90px bottom clearance for the fixed nav).

Panels are stacked directly and separated by `<hr class="seam">` — a 1px Seam line with zero margin. There are no gaps-as-cards; the seam is the only divider between the readout, the chart, and the device list.

Fixed bottom nav (max 520px, centered) sits above content with safe-area padding. Lists reserve 90px bottom padding so the last row clears the nav.

**Responsive:** at `min-width: 600px` the page background darkens to #070809 and the column seats into an instrument frame — 1px Seam border (no bottom border), `16px 16px 0 0` radius, and a single structural shadow — so the column reads as a seated panel rather than a floating sheet.

## Elevation & Depth

Flat by default. Depth between content regions is expressed entirely by the 1px Seam hairline, never by shadows or stacked cards. Channel cards and inputs use a 1px Seam border plus a one-step-lighter Panel fill for separation, not elevation.

Two shadows exist, both deliberate and non-decorative:

### Shadow Vocabulary
- **Desktop frame** (`box-shadow: 0 20px 60px rgba(0,0,0,.5)`): The one structural shadow. Seats the instrument column on wide viewports only.
- **Toast lift** (`box-shadow: 0 8px 24px rgba(0,0,0,.5)`): Floating transient notification above the nav.
- **Live-dot halo** (`box-shadow: 0 0 0 4px rgba(245,166,35,.14)`): A ring, not a drop shadow — the amber "live" glow on the brand mark dot.

### Named Rules
**The No-Shadow-To-Divide Rule.** Shadows never separate content. Regions divide by 1px Seam lines; shadow is used only to seat the desktop frame, float a toast, or halo the live dot.

## Shapes

Mostly rectilinear, lightly softened. Interactive controls (buttons, inputs, channel cards) use a 10px radius (`--r`). Small chrome (icon buttons, skeletons) uses 4–8px. Status LEDs, the live dot, and the chart peak are full circles. The toast is a full pill (999px). The desktop frame radius is 16px on the top corners only. Nothing is heavily rounded; the geometry stays instrument-crisp.

## Components

### Buttons
- **Primary** (`.btn`): Full-width Solar Amber fill, near-black text (#1a1205), weight 700, 10px radius, 15px padding, 0.02em tracking. Hover → Amber Hi. Active → `translateY(1px)`. Disabled → Amber Dim fill with Chassis text.
- **Icon button** (`.iconbtn`): Transparent, Ink 2 glyph, 8px padding, 8px radius. Hover → Ink glyph on Panel 2. The refresh button spins (`.spin`) while fetching. Used for the discreet top-bar actions (refresh, logout isolated at the end).

### Inputs / Fields
- **Style:** Panel fill, 1px Seam border, Ink text, 16px font (prevents iOS zoom), 14px padding, 10px radius. Placeholder in Ink 3.
- **Focus:** border shifts to Solar Amber, native outline removed. (Global `:focus-visible` is a 2px Amber outline, 2px offset.)

### Cards / Containers (Channel card)
- **Corner:** 10px radius.
- **Background:** Panel, with a 1px Seam border.
- **Shadow:** none (see Elevation).
- **Internal padding:** 16px. Heading in small-caps Title; a 2-column metric grid of mono figures below. A hot metric (`.v.hot`) turns amber/warn.

### Navigation
- Fixed bottom bar, translucent Chassis (`rgba(13,15,18,.86)`) with `backdrop-filter: blur(12px)` and a 1px Seam top border. Two tabs (Painel, Histórico), stacked icon + 10px uppercase Archivo label. Idle Ink 3; active (`.on`) Solar Amber.

### Device row
- Full-width borderless button, 1px Seam bottom divider (last row none). Left: status LED (green on / red off). Center: device name (Body) over mono serial (Ink 3). Right: mono power value in amber (Ink 3 when zero) + chevron. Hover nudges `translateX(5px)`.

### Live Readout (signature)
- The instrument face: a breathing live dot (green, 2.2s opacity pulse) beside a small-caps "Gerando agora" label, then the giant amber-hi mono power figure with a small amber unit, then a sub-row of Hoje/Total kWh figures. When off, the figure drops to Ink 3 and the dot stops breathing.

### Day-curve chart (signature)
- Inline SVG area chart, `preserveAspectRatio="none"`, 150px tall. Seam gridlines, Ink 3 mono axis labels, amber 2px line over an amber-gradient area fill, Amber Hi peak dot and dashed cursor.

### Transient / state
- **Toast:** pill, Panel 2 fill, 1px Seam border, rises 0.25s; bad variant borders Offline Red with a red dot.
- **Skeleton:** Panel→Panel 2 shimmer sweep (1.3s) at the shape of the incoming content.
- **Empty:** centered Ink 3 with a 44px half-opacity glyph icon and one line of prose.

## Do's and Don'ts

### Do:
- **Do** spend amber only on live generation data and the one active/primary state (The Amber-Is-Sunlight Rule).
- **Do** set every real reading in the monospace tabular face.
- **Do** divide regions with the 1px Seam hairline (`<hr class="seam">`), not cards or shadows.
- **Do** write section and field labels as uppercase tracked Archivo (small caps).
- **Do** keep inputs at 16px font to prevent mobile zoom.
- **Do** honor `prefers-reduced-motion` — all animation and transition is disabled under it.

### Don't:
- **Don't** use green or red for anything but online/offline status.
- **Don't** add drop shadows to divide or decorate; shadow is only the desktop frame, the toast, and the live-dot halo.
- **Don't** stack content as floating cards; the screen is one continuous instrument face.
- **Don't** set measurement figures in Archivo — that reads as decoration, not instrument output.
- **Don't** let the column free-float on wide screens; seat it in the instrument frame.
