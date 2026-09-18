Vantage is the design system behind a data-dense operations dashboard (bookings, reservations, calendars, blog and content tables) for a super-admin and hotel/venue admin audience. It reads as calm and professional first, with one confident accent — lime `brand-accent` — reserved for the things a person must notice: the active nav item, the primary metric, a call to action. Everything else stays quiet: near-white surfaces, a near-black sidebar and sunken panel, and a restrained neutral type scale.

## Content fundamentals

- Voice is direct and operational: labels are nouns ("Today's Revenue", "Pending Requests"), never sentences. Buttons are verbs in the imperative ("Add New Note", "Next Step", "Go Back") and always paired with a `‹`/`›` chevron in the direction of travel.
- Numbers carry the weight. A metric is always the largest, boldest element in its card (`stat-value`), with its label in `caption` beneath it — never the other way round.
- Dates render as `DD Mon` or `DD.MM.YYYY` (the blog table), never a bare timestamp. Currency is a trailing unit mark after the number ("1000 ₼"), not a leading symbol, so columns of numbers stay right-aligned and scannable.
- Empty and loading states use `body-lg` on `ink-secondary`, one short sentence, never an apology.

## Visual foundations

**Colour.** Two roles carry the interface: neutral surfaces (`surface-page`, `surface-card`) for nearly everything, and `surface-sidebar` / `surface-sunken` as fixed dark anchors that stay dark in both the light and dark theme — the sidebar is a piece of furniture, not a themed surface. `brand-accent` (lime) is spent on exactly one thing per screen: the active nav row, a headline stat's icon chip, or a hero CTA — never on more than one element at a time, and never as a background under long text (it fails contrast for body copy; pair it with `brand-accent-ink`, not `ink-on-dark`). Status colour (`status-success`, `status-warning`, `status-danger`, `status-info`) is reserved for booking/order states and is always background + text of the same family, never text alone on a neutral chip. Chart series pull from `chart-1…4` in that fixed order so a metric's colour stays consistent across a bar chart, a pie chart and its legend.

**Typography.** Nunito throughout — one rounded, friendly sans that scales from dashboard numerals down to table captions without a second family. Headings (`h1`–`h6`) are reserved for page titles and section headers; `stat-value` is a distinct style from `h1` because a KPI number and a page title never compete for the same weight. Table headers and badge text use `caption`, set in uppercase with `space-1` of letter-spacing added at implementation time.

**Spacing & layout.** Two independent grids, matching the reference layouts exactly: a **Sidebar Grid** — fixed `280px` wide (`72px` when collapsed to icon-only), `space-7` (32px) inner offset, `space-6` (24px) gutter between icon and label — and a **Primary Grid** for content, 6 columns, `160px` reference column width, `space-7` offset from the viewport edge, `space-6` gutter. Cards sit on `space-5` gaps in a grid; card interiors pad at `space-4`; a page's top header bar sits flush with `space-7` on either side.

**Elevation & shape.** Cards use `radius-lg` and `shadow-sm` at rest, no shadow increase on hover — hover is communicated by `surface-card-hover` or a border colour shift, never by lifting the card. Buttons and inputs use `radius-md`; badges, chips and the collapsed sidebar toggle use `radius-pill`. Room/venue photography and the dark "Overall Performance" hero panel use `radius-xl`.

**States.** Every interactive control defines five states, always in this order of visual weight: `default` → `hover` (background shifts one step, e.g. `surface-card` → `surface-card-hover`, or the sidebar's `ink-on-dark-secondary` label brightens to `ink-on-dark`) → `focus-visible` (a solid 2px `focus-ring` outline, 2px offset, on every surface including inside the dark sidebar) → `active/filled` → `disabled` (label drops to `ink-tertiary`, fill to `surface-input-disabled`, no pointer). Inputs additionally define an `error` state: border and helper text switch to `status-danger-ink`, background stays neutral (error is never a red fill).

**Motion.** Kept out of the token set on purpose — this is a data tool, not a marketing surface. Where a transition is implemented, keep it under 150ms, ease-out, on colour and transform only (menu collapse, tag hover); never on layout reflow of a data table.

## Iconography

Outline icons, 20px or 24px box, 1.5px stroke, rounded caps and joins — never filled glyphs except for status dots and the small circular alert badge on the calendar's red banner. An icon paired with a nav label always sits at `space-3` from the text; an icon alone (search, chat, bell in the header) sits in a 40px square hit target. Flag icons for the language switcher are the one place a filled, full-colour glyph is correct. No bespoke icon set ships with this release — implement against a licensed outline set (Phosphor, Lucide or Feather) at the weights above; if the product later ships its own icon font, swap it in as an `assets/Icons` group here without changing this guidance.

## Responsive & mobile

The product is used at three widths and none of them may lose a primary action:

- **Desktop (≥1280px):** the full Sidebar Grid stays expanded; content uses the 6-column Primary Grid; secondary panels (Notes, chat) sit in a fixed right rail as shown in the Calendar screen.
- **Tablet (768–1279px):** the sidebar collapses to its 72px icon-only rail by default (label on hover/focus, not on tap); the right rail stacks below the primary content instead of beside it; card grids drop from 3–4 columns to 2.
- **Mobile (<768px):** the sidebar becomes a bottom tab bar (max 5 primary destinations; the rest live under a "More" sheet) or a full-height drawer opened from the header — never a squeezed 72px column. Data tables convert to a stacked card per row (label/value pairs, `body-sm` labels in `ink-secondary`) rather than horizontal scroll. The header collapses search into an icon that expands to a full-width field on tap. Stat card grids go to a single column with `space-4` gaps; the KPI number stays `stat-value` size — it never shrinks on mobile, since it's the reason the card exists.

Touch targets are never smaller than 44×44px regardless of the desktop control's visual size (a 32px desktop icon button still gets a 44px tap area). Nothing essential is desktop-only: every primary action reachable at 1280px (add, edit, filter, export) has a mobile equivalent, typically promoted from an overflow menu to a visible button.

## Accessibility

Every text/background pairing above meets 4.5:1 in both themes (3:1 for `stat-value` and headings, which are always ≥24px). `status-danger` was shifted off pure red toward vermilion so it never reads as identical to `status-success` by hue alone for a colour-blind viewer; every status badge also carries a short word ("Paid", "Failed", "Pending"), never colour alone. Focus is always visible, including for keyboard users moving through the dark sidebar and the calendar grid.
