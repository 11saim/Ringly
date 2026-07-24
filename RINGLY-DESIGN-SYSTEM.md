# RINGLY DESIGN SYSTEM v2

> The design language for Ringly — an AI-first workspace for businesses that automate customer communication on WhatsApp.

---

## 1. Design Philosophy

Ringly is not a dashboard. It is not admin software. It is an AI workspace — a place where business owners work alongside intelligence to communicate with customers, manage bookings, and grow their business.

The design philosophy rests on one belief: **the best interface is the one that disappears.** When a restaurant owner is responding to a customer about a reservation, they should not think about the software. They should think about the customer.

### Core Beliefs

**Intelligence over decoration.** Every design decision should make the product feel smarter, not prettier. AI suggestions emerge from context. Smart defaults reduce clicks. The interface anticipates needs without being asked. Intelligence is communicated through clarity — not through flashy effects or decorative badges.

**Calm over excitement.** Premium products do not shout. They speak quietly with confidence. Ringly uses restraint as its primary design tool — fewer colors, fewer effects, fewer distractions. Calm is not boring; calm is trustworthy.

**Speed over polish.** A 150ms transition that feels instant is worth more than a 400ms animation that looks beautiful. Perceived performance is a design feature. Every interaction should feel like it responds at the speed of thought.

**Substance over style.** The interface exists to serve a purpose. Every element must earn its place. If removing an element does not reduce clarity, it should be removed.

**Workspace over dashboard.** A dashboard displays data. A workspace enables action. Ringly is built for doing — responding to customers, managing orders, running campaigns. The interface should feel like a tool you use, not a report you read.

---

## 2. UX Principles

### 2.1 Progressive Disclosure
Show only what is needed in the moment. Advanced options live one layer deeper. The default view should feel simple; power should be discoverable.

### 2.2 Contextual Intelligence
AI features appear where they are useful, not where they are decorative. An AI suggestion next to a compose box is useful. An AI badge in the sidebar is not.

### 2.3 Reduced Cognitive Load
Every screen should answer one question: "What should I do next?" If the answer is not immediately clear, the design has failed.

### 2.4 Consistent Mental Models
Similar actions should look and behave similarly. A primary action in conversations should feel the same as a primary action in orders. Predictability builds trust.

### 2.5 Forgiveness Over Precision
Prevent errors where possible. When they occur, offer easy recovery. Undo is better than confirmation dialogs. Defaults are better than required fields.

### 2.6 Accessibility First
Every interaction must work with keyboard navigation. Color is never the only indicator of meaning. Text contrast meets WCAG AA standards at minimum. Screen readers are not an afterthought.

---

## 3. Product Personality

The interface should feel:

- **Thoughtful** — every detail is considered, nothing is accidental
- **Confident** — the product knows what it is and does not try to be something else
- **Quiet** — it does not demand attention; it earns trust through consistency
- **Helpful** — it assists without being asked, guides without interrupting
- **Professional** — it respects the user's time and business
- **Fast** — it responds at the speed of thought, never making the user wait

The interface should never feel:

- **Playful** — this is a business tool, not a consumer toy
- **Decorative** — every element serves a function
- **Gimmicky** — no novelty effects, no unnecessary flourish
- **Flashy** — no dramatic animations, no attention-seeking behavior
- **"AI-looking"** — AI should not be a visual theme; it should be a quiet layer of intelligence beneath the surface

AI quietly assists the user. It does not perform.

---

## 4. Visual Language

### 4.1 Overall Aesthetic

Ringly's visual language draws from the confidence of Vercel, the warmth of Notion, and the intelligence of Linear — but belongs to none of them.

The aesthetic is **quiet modernism**: clean surfaces, precise typography, purposeful color, and generous space. It feels like a well-designed physical space — organized, calm, and easy to navigate.

There is no visual noise. No decorative gradients. No glass effects. No heavy shadows. Depth comes from hierarchy — larger text, bolder weight, more space — not from visual tricks.

### 4.2 What "Premium" Means for Ringly

Premium is not luxury. Premium is:
- **Consistency** — every screen feels like the same product
- **Restraint** — saying no to things that do not serve the user
- **Precision** — details are considered, not approximate
- **Speed** — interactions feel instantaneous
- **Confidence** — the product knows what it is

### 4.3 The AI Layer

AI is not a feature. It is not a visual theme. It is the layer beneath everything. The interface communicates intelligence not through color or badges, but through behavior:

- **Contextual suggestions** — AI recommends next actions based on conversation history
- **Smart defaults** — fields pre-fill with likely values
- **Insight cards** — subtle summaries that appear when relevant, using the same neutral card treatment as everything else
- **Predictive navigation** — the product learns what you use and surfaces it
- **Gentle guidance** — helpful prompts that teach without interrupting
- **Sparkle indicators** — a small sparkle icon (12px, `--text-tertiary`) next to AI-assisted elements, never a colored badge

AI is represented through small sparkle icons, subtle labels, and contextual behavior — never through a dedicated brand color. The interface remains mostly neutral. WhatsApp green remains the only primary accent.

---

## 5. Color System

### 5.1 Philosophy

Color in Ringly is used with extreme restraint. The palette is predominantly neutral — near-whites, warm grays, and near-blacks. Color appears only when it communicates meaning: status, action, or identity.

WhatsApp green is the single accent color, used sparingly to create connection points between the product and the platform it serves.

### 5.2 Primary Palette

**Backgrounds**
- `--bg-primary: #FFFFFF` — Main content surface
- `--bg-secondary: #FAFAFA` — Subtle elevation, sidebar
- `--bg-tertiary: #F5F5F5` — Input backgrounds, hover states
- `--bg-elevated: #FFFFFF` — Modals, dropdowns, popovers

**Surfaces**
- `--surface-primary: #FFFFFF` — Cards, panels
- `--surface-secondary: #F8F8F8` — Secondary surfaces
- `--surface-hover: #F2F2F2` — Hover state background
- `--surface-active: #EBEBEB` — Active/pressed state

**Borders**
- `--border-subtle: #E8E8E8` — Default borders, separators
- `--border-default: #D4D4D4` — Emphasis borders
- `--border-strong: #A3A3A3` — Focus rings, active states

**Text**
- `--text-primary: #171717` — Headings, primary content
- `--text-secondary: #525252` — Descriptions, secondary info
- `--text-tertiary: #737373` — Placeholders, hints
- `--text-disabled: #A3A3A3` — Disabled text

### 5.3 Accent Palette

**WhatsApp Green**
- `--accent-primary: #25D366` — Primary actions, brand connection
- `--accent-hover: #1FB855` — Hover state
- `--accent-active: #18A34A` — Active/pressed state
- `--accent-subtle: #E8F9EE` — Light backgrounds, badges
- `--accent-muted: #D1FADF` — Very light accents

### 5.4 Semantic Palette

**Success**
- `--success: #22C55E`
- `--success-subtle: #F0FDF4`

**Warning**
- `--warning: #F59E0B`
- `--warning-subtle: #FFFBEB`

**Error**
- `--error: #EF4444`
- `--error-subtle: #FEF2F2`

**Info**
- `--info: #3B82F6`
- `--info-subtle: #EFF6FF`

### 5.5 Color Rules

1. **80% neutral, 20% accent.** The interface should feel predominantly monochrome.
2. **Green is earned.** Use WhatsApp green only for primary CTAs, active states, and success indicators. Never for decoration.
3. **Semantic colors are functional.** Red means error. Yellow means caution. Green means success. Never repurpose.
4. **Never use color as the only indicator.** Every color-coded element must have a text label, icon, or pattern alternative.
5. **AI has no color.** Intelligence is communicated through behavior and small icons, not through a dedicated palette.

---

## 6. Typography

### 6.1 Font Stack

**Primary (UI)**
```
Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
```

**Monospace (Data, Code)**
```
"JetBrains Mono", "SF Mono", "Fira Code", monospace
```

### 6.2 Type Scale

| Token | Size | Line Height | Weight | Use |
|---|---|---|---|---|
| `display-lg` | 36px | 40px | 700 | Page titles (rare) |
| `display` | 30px | 36px | 700 | Section headers |
| `heading-lg` | 24px | 32px | 600 | Card titles |
| `heading` | 20px | 28px | 600 | Subsection headers |
| `heading-sm` | 16px | 24px | 600 | Small headers |
| `body-lg` | 16px | 24px | 400 | Primary body text |
| `body` | 14px | 20px | 400 | Default text |
| `body-sm` | 13px | 18px | 400 | Secondary text |
| `caption` | 12px | 16px | 500 | Labels, metadata |
| `overline` | 11px | 16px | 600 | Uppercase labels |
| `mono` | 13px | 20px | 400 | Code, data |

### 6.3 Typography Rules

1. **Never use more than 3 type sizes on a single screen.** Hierarchy comes from weight and color, not constant size changes.
2. **Line height should be 1.4–1.6× font size for body text.** Tighter for headings (1.2–1.3×), looser for small text (1.5×).
3. **Letter-spacing: 0 for body, -0.01em for headings, +0.05em for overlines.**
4. **Maximum line length: 65–75 characters.** Longer lines reduce readability.
5. **Font weight changes communicate hierarchy.** 400 for body, 500 for labels, 600 for headings, 700 for display.
6. **Text is never bolded within body paragraphs.** Bold is reserved for headings and labels.

---

## 7. Spacing System

### 7.1 Base Unit

**4px base grid.** All spacing values are multiples of 4px.

### 7.2 Spacing Scale

| Token | Value | Use |
|---|---|---|
| `space-0` | 0px | — |
| `space-1` | 4px | Tight spacing, icon gaps |
| `space-2` | 8px | Inline elements, small gaps |
| `space-3` | 12px | Input padding, small card padding |
| `space-4` | 16px | Standard padding, gaps |
| `space-5` | 20px | Card padding |
| `space-6` | 24px | Section spacing |
| `space-8` | 32px | Large gaps |
| `space-10` | 40px | Page padding (desktop) |
| `space-12` | 48px | Major section spacing |
| `space-16` | 64px | Page-level spacing (rare) |

### 7.3 Spacing Rules

1. **Consistency over variety.** Use the same spacing for similar contexts throughout the product.
2. **Nesting increases spacing.** Nested elements get progressively larger outer spacing.
3. **Page padding is generous.** Content should never touch screen edges.
4. **Section spacing is double the internal spacing.** If a card has 16px internal padding, sections are separated by 32px.

---

## 8. Border Radius System

### 8.1 Radius Scale

| Token | Value | Use |
|---|---|---|
| `radius-none` | 0px | — |
| `radius-sm` | 4px | Tags, small badges |
| `radius-md` | 6px | Inputs, buttons, small elements |
| `radius-lg` | 8px | Cards, panels, modals |
| `radius-xl` | 12px | Large cards, feature panels |
| `radius-full` | 9999px | Avatars, pills, circular elements |

### 8.2 Radius Rules

1. **Consistency across similar elements.** All buttons share the same radius. All cards share the same radius.
2. **Nested elements inherit parent radius minus padding.** A button inside a card should not have larger radius than the card.
3. **Avoid mixing radii.** A card with 8px radius should contain elements with 6px radius or less.
4. **Full radius is reserved for circular elements.** Avatars, status dots, and pill badges.

---

## 9. Shadow System

### 9.1 Philosophy

Ringly uses shadows with extreme restraint. Depth is primarily communicated through spacing, borders, and background color differences.

Cards may use an extremely subtle shadow — just enough to separate layers without creating a floating appearance. Floating elements (dropdowns, modals, drawers) use more visible shadows for necessary elevation.

### 9.2 Shadow Scale

| Token | Value | Use |
|---|---|---|
| `shadow-card` | `0 1px 2px rgba(0,0,0,0.03)` | Card separation (optional, subtle) |
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Dropdowns, popovers |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)` | Modals, drawers |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Large modals (rare) |

### 9.3 Shadow Rules

1. **Cards may use `shadow-card`** — an extremely subtle shadow (`0 1px 2px rgba(0,0,0,0.03)`). This is optional and should be used consistently or not at all within a view.
2. **Shadows never create floating appearance.** A card shadow separates layers; it does not lift the card off the surface.
3. **Shadow opacity never exceeds 0.1** for cards. Floating elements may use higher opacity.
4. **No colored shadows.** All shadows use black with opacity.
5. **Borders remain the primary separator.** Shadows supplement borders; they do not replace them.

---

## 10. Information Density Philosophy

### 10.1 Core Principle

Ringly prefers layouts that are **compact, scannable, and efficient.** Users should be able to understand an entire page without excessive scrolling.

### 10.2 Density Rules

1. **Compact over oversized.** Cards, metrics, and list items should use space efficiently. Avoid huge cards with minimal content.
2. **Scannable over decorative.** Information should be easy to scan with the eye. Large typography and excessive whitespace slow scanning.
3. **Efficient over spacious.** Every pixel should serve a purpose. Oversized whitespace is wasted space.
4. **Maximize useful information.** Each screen should show as much relevant information as possible while remaining visually calm.
5. **Avoid oversized metrics.** A metric value does not need to be 48px to be important. 24–28px is sufficient when hierarchy is clear.
6. **Avoid oversized typography.** Display sizes (30–36px) are reserved for page titles only. Everything else is smaller.
7. **Avoid excessive scrolling.** If a page requires scrolling to understand its purpose, the density is too low.

### 10.3 Density is Not Clutter

Density does not mean cramming information. It means:
- Using appropriate spacing (not too tight, not too loose)
- Showing relevant data without unnecessary chrome
- Allowing the eye to move quickly between elements
- Providing clear hierarchy so important information stands out

---

## 11. Layout System

### 11.1 Sidebar

- **Width:** 288px (desktop), 256px (tablet), drawer overlay (mobile)
- **Background:** `--bg-secondary` (#FAFAFA)
- **Border:** 1px right border using `--border-subtle`
- **Padding:** 12px horizontal, 16px vertical between groups
- **Behavior:** Always visible on desktop and tablet. Never collapses. Never enters icon-only mode.
- **Position:** Fixed left, full height

### 11.2 Header

- **Height:** 64px
- **Background:** `--bg-primary` (#FFFFFF)
- **Border:** 1px bottom border using `--border-subtle`
- **Padding:** 32px horizontal, 0 vertical
- **Position:** Fixed top, right of sidebar
- **Contains:** Page title, search bar, notifications, user menu

### 11.3 Content Area

- **Max width:** None — content uses available screen width
- **Page padding:** 40px (desktop), 28px (tablet), 20px (mobile)
- **Grid columns:** 12-column grid
- **Grid gutter:** 24px
- **Breakpoint:** Content reflows at 768px

**Exception:** Forms and documentation pages may use constrained widths (max 640–720px) for readability.

### 11.4 Vertical Rhythm

- **Section spacing:** 40px between major sections
- **Component spacing:** 20px between related components
- **Item spacing:** 12px between list items
- **Tight spacing:** 8px between inline elements

### 11.5 Layout Rules

1. **Fixed sidebar, scrollable content.** The sidebar never scrolls.
2. **Content uses available width.** No artificial max-width on dashboards and data views.
3. **Header sticks to top.** Scrolling reveals content beneath a fixed header.
4. **Mobile-first reflows.** Layouts reflow cleanly at 768px and 480px breakpoints.
5. **No horizontal scrolling.** Content always fits within viewport width.

---

## 12. Component Philosophy

### 12.1 Core Principle

Every component in Ringly follows the same DNA: **simple surfaces, clear hierarchy, minimal chrome.**

Components should feel like they belong to the same family. A button should not look like it was designed separately from an input. A card should not feel like it belongs to a different product.

### 12.2 Component Design Rules

1. **Borders over shadows.** Components are separated by 1px borders, not shadows.
2. **Padding is generous but not excessive.** Components should breathe without wasting space.
3. **Hover states are subtle.** Background shifts of 2-5% opacity. No scale transforms, no color inversions.
4. **Focus states are visible.** 2px focus ring using `--accent-primary` with 2px offset.
5. **Disabled states are clear.** 50% opacity, no pointer events, cursor: not-allowed.
6. **Loading states are honest.** Skeleton screens over spinners. Progress is communicated through layout, not loading icons.

---

## 13. Component Language

### 13.1 Buttons

**Primary Button**
- Background: `--accent-primary` (#25D366)
- Text: White, 14px, weight 500
- Padding: 10px 20px
- Border radius: 6px
- Hover: Darken by 8%
- Active: Darken by 12%
- Used for: Main actions (Send, Save, Create)

**Secondary Button**
- Background: Transparent
- Border: 1px solid `--border-default`
- Text: `--text-primary`, 14px, weight 500
- Padding: 10px 20px
- Border radius: 6px
- Hover: Background `--surface-hover`
- Used for: Secondary actions (Cancel, Back)

**Ghost Button**
- Background: Transparent
- Border: None
- Text: `--text-secondary`, 14px, weight 500
- Padding: 10px 20px
- Border radius: 6px
- Hover: Background `--surface-hover`
- Used for: Tertiary actions, navigation

**Icon Button**
- Background: Transparent
- Border: None
- Size: 32px × 32px
- Border radius: 6px
- Icon: 16px, `--text-secondary`
- Hover: Background `--surface-hover`
- Used for: Toolbar actions, inline actions

### 13.2 Inputs

**Text Input**
- Background: `--bg-primary`
- Border: 1px solid `--border-subtle`
- Padding: 10px 14px
- Border radius: 6px
- Font: 14px, weight 400
- Placeholder: `--text-tertiary`
- Focus: Border color `--accent-primary`, 2px focus ring
- Used for: Forms, search, compose

**Textarea**
- Same styling as text input
- Min height: 120px
- Resizable: vertical only
- Used for: Long-form content, messages

**Select/Dropdown**
- Same styling as text input
- Right icon: chevron-down (16px)
- Menu: `--bg-elevated`, `--shadow-sm`, max-height 240px, overflow-y auto
- Item padding: 10px 14px
- Item hover: `--surface-hover`
- Used for: Selection menus

### 13.3 Navigation

**Sidebar Navigation**
- Items: 40px height, 12px horizontal padding
- Border radius: 6px
- Active: Background `--accent-subtle`, text `--accent-primary`, left border 2px `--accent-primary`
- Hover: Background `--surface-hover`
- Icon: 18px, left-aligned
- Label: 14px, weight 500
- Used for: Primary navigation

**Tab Navigation**
- Items: 40px height, 16px horizontal padding
- Border-bottom: 2px solid transparent
- Active: Border-bottom `--accent-primary`, text `--text-primary`
- Hover: Background `--surface-hover`
- Used for: Section navigation within pages

### 13.4 Cards

**Standard Card**
- Background: `--surface-primary`
- Border: 1px solid `--border-subtle`
- Border radius: 8px
- Padding: 20px
- Shadow: `0 1px 2px rgba(0,0,0,0.03)` (optional, consistent within view)
- Hover: Border color `--border-default` (subtle emphasis)
- Used for: Content containers, feature panels

**Metric Card**
- Same as standard card
- Contains: Label (caption), Value (heading-sm, weight 600), Trend (body-sm, colored)
- Compact sizing: 16px vertical padding
- Used for: Dashboard metrics, KPIs

**Interactive Card**
- Same as standard card
- Hover: Background `--surface-hover`, cursor pointer
- Used for: Clickable items, list entries

### 13.5 Tables

- Border-collapse: separate
- Border-spacing: 0
- Header: Background `--bg-secondary`, text `--text-secondary`, weight 500, 12px uppercase
- Row: Border-bottom 1px `--border-subtle`
- Row hover: Background `--surface-hover`
- Cell padding: 12px 16px
- Font: 14px, weight 400
- No vertical borders
- Used for: Data lists, records, logs

### 13.6 Badges

- Font: 11px, weight 600, uppercase, letter-spacing 0.05em
- Padding: 4px 8px
- Border radius: 4px
- Variants: success (green), warning (yellow), error (red), info (blue), neutral (gray)
- Used for: Status indicators, counts, labels

### 13.7 Tags

- Font: 12px, weight 500
- Padding: 4px 10px
- Border radius: 4px
- Background: `--bg-tertiary`
- Border: 1px solid `--border-subtle`
- Removable: X icon on hover
- Used for: Filters, labels, categories

### 13.8 Charts

- Style: Clean, minimal
- Axes: 1px `--border-subtle`
- Grid: Dashed, `--border-subtle`, 0.5 opacity
- Data: Maximum 4 colors, muted tones
- Labels: `--text-tertiary`, 12px
- No legends when possible (inline labels preferred)
- Tooltip: `--bg-elevated`, `--shadow-sm`, 12px padding
- Used for: Analytics, trends, metrics

### 13.9 Drawers

- Width: 400px (standard), 600px (wide)
- Background: `--bg-elevated`
- Shadow: `--shadow-md`
- Overlay: rgba(0,0,0,0.3)
- Header: 64px height, border-bottom
- Body: Scrollable, 32px padding
- Used for: Detail views, editing, forms

### 13.10 Dialogs

- Max width: 480px
- Background: `--bg-elevated`
- Border radius: 12px
- Shadow: `--shadow-md`
- Overlay: rgba(0,0,0,0.3)
- Padding: 24px
- Header: 20px, weight 600
- Body: 14px, `--text-secondary`
- Footer: Right-aligned buttons, gap 12px
- Used for: Confirmations, alerts, focused tasks

### 13.11 Command Palette

- Max width: 640px
- Position: Centered, 20% from top
- Background: `--bg-elevated`
- Border radius: 12px
- Shadow: `--shadow-lg`
- Search: 48px input at top
- Results: Scrollable list, 40px items
- Keyboard: ↑↓ to navigate, Enter to select, Esc to close
- Used for: Quick actions, navigation, search

### 13.12 Search

- Global search in header: Prominent, 100% available width within header constraints
- Style: Same as text input, with search icon left-aligned
- Placeholder: "Search conversations..."
- Shortcut indicator: Ctrl+K / ⌘K on right side
- Used for: Finding conversations, contacts, content

### 13.13 Avatars

- Sizes: 24px (sm), 32px (md), 40px (lg), 56px (xl)
- Border radius: Full circle
- Fallback: Initials on `--bg-tertiary`
- Online indicator: 8px circle, `--success`, bottom-right
- Used for: User representation, contact photos

### 13.14 Metrics

- Label: 12px, `--text-tertiary`, weight 500
- Value: 24px, `--text-primary`, weight 600
- Trend: 13px, colored (green up, red down)
- Used for: KPIs, dashboard data

### 13.15 AI Sparkle Indicator

- Icon: Sparkle (12px), `--text-tertiary`
- Position: Inline, right of label or above element
- Used for: Indicating AI-assisted or AI-generated content
- Rule: Never use a colored badge or purple background for AI

---

## 14. Motion Philosophy

### 14.1 Core Principle

Motion in Ringly exists to communicate state change, not to delight. Every animation must answer: "Does this help the user understand what just happened?" Motion should make the interface feel faster rather than more exciting.

### 14.2 What to Animate

Only animate these properties:
- **Opacity** — fading elements in/out
- **Color** — background and border color transitions
- **Background** — background color shifts
- **Border** — border color and style changes
- **Dropdowns** — opening/closing menus
- **Drawers** — sliding panels in/out
- **Hover states** — subtle background and color shifts

### 14.3 What Never to Animate

- **Layout** — never animate size, position, or dimensions of containers
- **Page load** — the page appears immediately, no entrance animations
- **Large containers** — never animate entire panels, cards, or content blocks
- **Typography** — never animate font size, weight, or line height
- **Grid reflow** — never animate grid or flex layout changes

### 14.4 Transition Durations

| Token | Duration | Use |
|---|---|---|
| `duration-instant` | 75ms | Micro-interactions, hover states |
| `duration-fast` | 150ms | Button states, toggle switches |
| `duration-normal` | 200ms | Panel transitions, dropdowns |
| `duration-slow` | 300ms | Drawers (rare) |

### 14.5 Easing

| Token | Value | Use |
|---|---|---|
| `ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Most transitions |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exiting elements |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Entering elements |

### 14.6 Motion Rules

1. **Transitions only.** No keyframe animations. No loading spinners (use skeletons). No bouncing, pulsing, or wobbling.
2. **Fast is premium.** If a transition feels slow, it is slow. 150ms is the default.
3. **Opacity over transform.** Prefer fading in/out over sliding. Sliding should only happen for drawers.
4. **No animation on first load.** The page should appear immediately. Animations are for subsequent interactions only.
5. **Respect prefers-reduced-motion.** All transitions are disabled when the user has reduced motion enabled.
6. **Motion should feel faster, not more exciting.** The goal is perceived performance, not visual delight.

---

## 15. Interaction Rules

### 15.1 Hover States

- **Buttons:** Background darkens by 8%, border darkens by one step
- **Cards:** Border strengthens to `--border-default`
- **Table rows:** Background shifts to `--surface-hover`
- **Links:** Color shifts to `--accent-primary`
- **Icons:** Color shifts from `--text-tertiary` to `--text-primary`
- **Duration:** 75ms

### 15.2 Focus States

- **Visible focus ring:** 2px solid `--accent-primary`, 2px offset
- **Keyboard navigation:** Tab order follows logical reading order
- **Focus trap:** Modals and drawers trap focus until closed
- **Focus restoration:** Focus returns to trigger element when overlay closes

### 15.3 Active States

- **Buttons:** Background darkens by 12%
- **Toggles:** Immediate visual change
- **Selections:** Immediate visual confirmation

### 15.4 Cursor Rules

- **Default:** Pointer on clickable elements
- **Text:** On text inputs and editable areas
- **Move:** On draggable elements
- **Not-allowed:** On disabled elements
- **Grab/grabbing:** On drag handles (if applicable)

---

## 16. Empty States

### 16.1 Philosophy

Empty states are not errors. They are opportunities to guide the user.

### 16.2 Structure

1. **Illustration or icon:** Simple, monochromatic, 64px
2. **Title:** 16px, weight 600, `--text-primary`
3. **Description:** 14px, `--text-secondary`, 1-2 sentences
4. **Action:** Primary button to resolve the empty state

### 16.3 Examples

- **No conversations:** "Start a conversation" with a compose button
- **No contacts:** "Import your contacts" with an upload button
- **No analytics:** "Analytics will appear after your first campaign"
- **No bookings:** "Set up your booking page"

### 16.4 Rules

1. **Always explain what the empty state means.** "No data" is not helpful. "No conversations yet" is.
2. **Always provide a next action.** The user should never stare at an empty screen wondering what to do.
3. **Never use empty states for errors.** Errors have their own treatment.

---

## 17. Loading States

### 17.1 Philosophy

Loading states communicate that the product is working, not broken. They should feel honest and predictable.

### 17.2 Skeleton Screens

- **Style:** Rectangular blocks matching content layout
- **Color:** `--bg-tertiary` with subtle shimmer animation
- **Shimmer:** Left-to-right gradient sweep, 1.5s loop
- **Layout:** Mirrors the final content structure
- **Used for:** Page loads, data fetching, content rendering

### 17.3 Inline Loaders

- **Style:** Simple dots or line, 16px
- **Color:** `--text-tertiary`
- **Used for:** Button loading states, inline saves

### 17.4 Rules

1. **Skeletons over spinners.** Always. Skeletons communicate structure; spinners communicate nothing.
2. **Never show loading for <200ms.** If it's fast, show it immediately.
3. **Always show what's loading.** Never gray out the entire screen.
4. **Progress is better than indeterminate.** When possible, show progress bars.

---

## 18. Sidebar Philosophy

### 18.1 Purpose

The sidebar is the permanent navigation of the workspace. It is always visible, always readable, always calm. It provides instant access to every major area of the product without requiring interaction to reveal.

### 18.2 Structure

**Top Section (Fixed)**
- Logo/brand mark
- Workspace name

**Navigation Sections (Scrollable)**

```
WORKSPACE

  Overview
  Inbox
  Customers

AI

  AI Agent
  Knowledge Base

BUSINESS

  Bookings
  Orders
  Products
  Services

GROWTH

  Broadcasts
  Analytics

SYSTEM

  Integrations
  Team
  Billing
  Settings
```

**Bottom Section (Fixed)**
- User profile (avatar, name, email)
- Workspace switcher (if applicable)

### 18.3 Behavior

- **Desktop (≥1024px):** 288px width, always visible, never collapses
- **Tablet (768–1023px):** 256px width, always visible, never collapses
- **Mobile (<768px):** Drawer overlay, triggered by hamburger menu
- **No collapse button.** No icon-only mode. No floating navigation.
- **Labels are always visible.** Every navigation item shows its icon and label at all times.

### 18.4 Visual Treatment

- **Background:** `--bg-secondary`
- **Section headings:** 11px, weight 600, uppercase, letter-spacing 0.05em, `--text-tertiary`, 24px top padding, 8px bottom padding
- **Nav items:** 36px height, 10px horizontal padding, border-radius 6px
- **Active item:** Background `--accent-subtle`, text `--accent-primary`, left border 2px `--accent-primary`
- **Hover:** Background `--surface-hover`
- **Dividers:** Not used — spacing between sections provides separation

### 18.5 Design Rules

1. **Never collapse on desktop.** The sidebar is always 288px with labels visible.
2. **Never enter icon-only mode.** Users should never have to guess what an icon means.
3. **Section headings are clear.** Uppercase, small, muted — they organize without distracting.
4. **Navigation is effortless to scan.** The eye should move naturally from section to section.
5. **The sidebar feels calm.** It is the anchor of the workspace — always there, never demanding attention.

---

## 19. Header Philosophy

### 19.1 Purpose

The header provides context and global actions. It answers: "Where am I?" and "What can I do?" Search is the primary interaction — always accessible, always prominent.

### 19.2 Structure

**Left:** Page title (16px, weight 600)
**Center:** Search bar (prominent, takes available space)
**Right:** Notifications, user menu

### 19.3 Visual Treatment

- **Height:** 64px
- **Background:** `--bg-primary`
- **Border:** 1px bottom `--border-subtle`
- **Padding:** 32px horizontal

### 19.4 Search as Primary Interaction

The search bar is the header's centerpiece:
- Placeholder: "Search conversations..."
- Shortcut indicator: Ctrl+K / ⌘K on the right
- Always visible, never collapsed into an icon
- Takes available horizontal space between title and actions

### 19.5 Rules

1. **Title is always visible.** Even when scrolled, the user knows where they are.
2. **Search is always accessible.** It is the primary interaction in the header.
3. **No excessive actions.** Maximum 4-5 items in the right section.
4. **Never crowded.** The header has generous breathing room — 64px height provides ample vertical space.

---

## 20. Card Philosophy

### 20.1 Purpose

Cards are content containers. They group related information without visual clutter.

### 20.2 Visual Treatment

- **Background:** `--surface-primary`
- **Border:** 1px solid `--border-subtle`
- **Border radius:** 8px
- **Padding:** 20px
- **Shadow:** `0 1px 2px rgba(0,0,0,0.03)` (optional — use consistently within a view or not at all)

### 20.3 Card Hierarchy

**Level 1 (Default):** Standard card with border and optional subtle shadow
**Level 2 (Elevated):** Card within a card, subtle background difference
**Level 3 (Floating):** Modals, drawers (shadows allowed here)

### 20.4 Rules

1. **Cards are not buttons.** If a card is clickable, add a hover state and cursor pointer. Otherwise, it is a container.
2. **Cards should not nest deeply.** Maximum 2 levels of nesting.
3. **Card titles are consistent.** Same size, same weight, same position across all cards.
4. **Shadows are optional but consistent.** If one card in a view uses a shadow, all cards in that view should use it.

---

## 21. Table Philosophy

### 21.1 Purpose

Tables display structured data. They should be scannable, sortable, and clear.

### 21.2 Visual Treatment

- **Header:** `--bg-secondary`, uppercase labels, 11px, weight 600
- **Rows:** Separated by 1px `--border-subtle`
- **Hover:** Background `--surface-hover`
- **Cells:** 12px vertical, 16px horizontal padding
- **No vertical borders**

### 21.3 Table Rules

1. **Tables are for data, not layout.** Use cards for content layout.
2. **Sort indicators are clear.** Arrow icon in header, active column highlighted.
3. **Empty rows are not shown.** If no data, show empty state instead.
4. **Actions are contextual.** Row actions appear on hover, not always visible.

---

## 22. Accessibility Rules

### 22.1 Color Contrast

- **Normal text (14px):** Minimum 4.5:1 contrast ratio
- **Large text (18px+):** Minimum 3:1 contrast ratio
- **Interactive elements:** Minimum 3:1 contrast ratio against background
- **Focus indicators:** Minimum 3:1 contrast ratio

### 22.2 Keyboard Navigation

- **Tab order:** Logical, follows reading order
- **Focus trap:** Modals and drawers trap focus
- **Escape:** Closes overlays, returns focus to trigger
- **Arrow keys:** Navigate within groups (tabs, menus, lists)
- **Enter/Space:** Activates focused element

### 22.3 Screen Readers

- **Semantic HTML:** Use proper heading hierarchy, landmarks, lists
- **ARIA labels:** All interactive elements have accessible names
- **Live regions:** Dynamic content updates are announced
- **Alt text:** All images have descriptive alt text
- **Skip links:** "Skip to main content" on every page

### 22.4 Motion

- **prefers-reduced-motion:** All transitions disabled
- **No auto-playing animations**
- **No flashing content**

### 22.5 Forms

- **Labels:** Every input has a visible label
- **Error messages:** Descriptive, associated with input via aria-describedby
- **Required fields:** Indicated with asterisk and aria-required
- **Grouped fields:** Wrapped in fieldset with legend

---

## 23. Responsive Rules

### 23.1 Breakpoints

| Name | Width | Behavior |
|---|---|---|
| Desktop | ≥1024px | Full layout, sidebar 288px |
| Tablet | 768–1023px | Sidebar 256px, content reflows |
| Mobile | <768px | Sidebar drawer, single column |

### 23.2 Desktop (≥1024px)

- Sidebar: 288px, always visible, never collapsed
- Content area: 12-column grid, full width
- Page padding: 40px
- Full header with prominent search

### 23.3 Tablet (768–1023px)

- Sidebar: 256px, always visible, never collapsed
- Content area: 8-column grid
- Page padding: 28px
- Header maintains search prominence

### 23.4 Mobile (<768px)

- Sidebar: Drawer overlay (hamburger menu)
- Content area: Full width, single column
- Page padding: 20px
- Stacked navigation
- Bottom action bar for primary actions

### 23.5 Responsive Rules

1. **Content reflows, not shrinks.** Text never becomes unreadable.
2. **Touch targets are 44px minimum.** All interactive elements meet Apple HIG guidelines.
3. **Gestures are optional.** All actions have button alternatives.
4. **Orientation is supported.** Both portrait and landscape.

---

## 24. Design Refinement Principles

These principles guide every design decision in Ringly.

1. **Every pixel has a purpose.** If an element does not serve a function, it does not exist.
2. **Alignment is more important than decoration.** Precise alignment creates visual order without effects.
3. **Whitespace is intentional.** Space separates, groups, and creates hierarchy. It is never accidental.
4. **Consistency beats creativity.** Predictable patterns build trust. Novelty in UI is rarely a virtue.
5. **Interfaces should disappear behind the user's work.** The product is a tool, not a destination.
6. **Remove visual noise before adding visual effects.** Subtraction is almost always better than addition.
7. **Hierarchy should come from typography and spacing rather than color.** Color is a functional signal, not a hierarchical tool.
8. **Simplicity is not the absence of complexity.** The product can be powerful while the interface remains simple.
9. **Details compound.** One imprecise margin is forgiveable. Ten imprecise margins destroy trust.
10. **The user should never have to think about the interface.** If they notice the design, something is wrong.

---

## 25. Do's

- Use generous whitespace to reduce cognitive load
- Keep the color palette predominantly neutral
- Use WhatsApp green only for primary actions and success states
- Prefer skeleton screens over spinners
- Make all interactive elements keyboard accessible
- Use consistent border radius across similar components
- Keep transitions under 200ms
- Show one primary action per screen area
- Use clear, descriptive labels
- Provide helpful empty states with next actions
- Respect user's motion preferences
- Use semantic HTML and proper heading hierarchy
- Keep maximum line length under 75 characters
- Show loading states for operations >200ms
- Use progressive disclosure for complex features
- Make focus states visible and consistent
- Keep the sidebar always visible with labels on desktop
- Make search the primary header interaction
- Use compact, scannable layouts that maximize information

## 26. Don'ts

- Don't use gradients as decorative elements
- Don't use glassmorphism or frosted glass effects
- Don't use heavy drop shadows
- Don't use more than 3 type sizes per screen
- Don't use color as the only indicator of meaning
- Don't auto-play animations or videos
- Don't use loading spinners for content areas
- Don't nest cards more than 2 levels deep
- Don't use borders on every element (selective use)
- Don't use uppercase text for body content
- Don't use center-aligned text for body paragraphs
- Don't use justified text
- Don't create rainbow dashboards with many colors
- Don't use emojis in the UI (unless user-generated content)
- Don't use decorative illustrations in data-heavy views
- Don't make the user confirm obvious actions
- Don't use jargon or technical language in labels
- Don't create modals for information that can be inline
- Don't hide primary actions behind menus
- Don't use placeholder text as labels
- Don't collapse the sidebar on desktop
- Don't use icon-only navigation without labels
- Don't assign AI its own brand color
- Don't animate layout, page load, or large containers
- Don't create oversized metric cards or excessive whitespace
- Don't make the interface feel playful or gimmicky

---

## 27. Quality Standard

Every future screen in Ringly should be reviewed against these questions:

1. **Does this reduce cognitive load?** The user should understand the screen instantly.
2. **Can the page be understood within five seconds?** If not, the hierarchy or density is wrong.
3. **Does every element justify its existence?** Remove anything that does not serve a function.
4. **Can spacing be improved?** Check alignment, consistency, and rhythm.
5. **Can hierarchy be improved?** Ensure the eye moves naturally from most to least important.
6. **Can color usage be reduced?** Every color should communicate meaning, not decoration.
7. **Can interactions become simpler?** Fewer clicks, fewer decisions, fewer steps.
8. **Would this feel believable inside a billion-dollar AI startup?** The product should feel premium, confident, and intelligent.

If the answer to any question is "no," revise before shipping.

---

## 28. Design Tokens Summary

### Colors
- Primary backgrounds: White (#FFFFFF), Near-white (#FAFAFA), Light gray (#F5F5F5)
- Text: Near-black (#171717), Dark gray (#525252), Gray (#737373)
- Borders: Light (#E8E8E8), Default (#D4D4D4), Strong (#A3A3A3)
- Accent: WhatsApp green (#25D366)
- Semantic: Success (#22C55E), Warning (#F59E0B), Error (#EF4444), Info (#3B82F6)

### Typography
- Font: Inter
- Scale: 11px to 36px
- Weights: 400, 500, 600, 700

### Spacing
- Base: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

### Radius
- Scale: 0, 4, 6, 8, 12, full

### Shadows
- Card: `0 1px 2px rgba(0,0,0,0.03)` (optional, subtle)
- Floating: sm, md, lg (for dropdowns, modals, drawers)

### Motion
- Duration: 75ms, 150ms, 200ms, 300ms
- Easing: default, ease-in, ease-out
- Animate only: opacity, color, background, border, dropdowns, drawers, hover states

### Layout
- Sidebar: 288px (desktop), 256px (tablet), drawer (mobile)
- Header: 64px height
- Page padding: 40px (desktop), 28px (tablet), 20px (mobile)
- Grid: 12 columns, 24px gutter

---

*This document is the single source of truth for every future UI decision in Ringly. All component designs, layouts, and interactions must conform to these principles.*
