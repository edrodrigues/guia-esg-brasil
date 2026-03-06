# Design System: Emerald Glass (Guia ESG Brasil)

## 🌿 Vision Statement
To transform the **Guia ESG Brasil** from a playful gamified tool into a high-integrity **Enterprise Sustainability Hub**. The design balances the prestige required by **CEOs** with the interactive engagement needed by **Employees**, using a refined **Glassmorphic** aesthetic (Intensity 3/10) and a **Sustainability Emerald** anchor.

---

## 🎨 Design Tokens

### 1. Colors (Sustainability Emerald Base)
| Token | Hex | Role |
|-------|-----|------|
| Primary (Emerald) | `#10b981` | Brand anchor, CTAs, success states |
| Primary Soft | `rgba(16, 185, 129, 0.1)` | Surface tints, active Nav backgrounds |
| Surface (Light) | `rgba(255, 255, 255, 0.9)` | Glass cards, modals (Light Mode) |
| Surface (Dark) | `rgba(15, 23, 42, 0.8)` | Glass cards, modals (Dark Mode) |
| Border (Emerald) | `rgba(16, 185, 129, 0.2)` | 1px precision strokes for cards |
| Text (Slate) | `#0f172a` | High-contrast body text |

### 2. Typography
- **UI & Navigation:** `Fira Sans` (Sans-serif) - Approachable, professional.
- **Metrics & Data:** `Fira Code` (Monospace) - Technical, analytical, high-integrity.
- **Scale:** 
  - Body: 16px (1rem)
  - Headlines: Medium/Semi-Bold weights (avoid Extra Bold for enterprise).

### 3. Glassmorphism (Intensity 3/10)
- **Blur:** `backdrop-blur-md` (12px blur radius).
- **Stroke:** `1px` solid border with emerald/slate transparency.
- **Shadow:** `shadow-xl shadow-emerald-900/5` (soft ambient elevation, no hard offsets).
- **Radius:** `16px` to `24px` (Biophilic/Organic curves).

---

## 🛠 Step-by-Step Implementation Plan

### Phase 1: Infrastructure & Configuration
1. **Fonts:** Update `index.html` or `index.css` to import Google Fonts:
   - `Fira Code:wght@400;500;600`
   - `Fira Sans:wght@400;500;600`
2. **Tailwind Config:** 
   - Add `fira-code` and `fira-sans` to `extend.fontFamily`.
   - Ensure the `primary` color variable points strictly to Emerald `#10b981`.
   - Create custom `glass` utilities or extend `backdropBlur`.

### Phase 2: Core Layout Transformation
1. **Floating Sidebar:**
   - Update `Sidebar.tsx` to use `fixed top-4 bottom-4 left-4 w-72`.
   - Apply `bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl`.
   - Replace chunky active states with `bg-emerald-500/10 text-emerald-500`.
2. **Dashboard Shell:**
   - Adjust `DashboardLayout` padding to provide a "breathable" margin around the floating shell.

### Phase 3: Component Surface Refinement
1. **Card Component:**
   - Global search/replace for `chunky-shadow` with the new ambient `shadow-xl`.
   - Update `Card.tsx` (if centralized) to use 1px emerald borders (`border-emerald-500/10`).
   - Standardize `rounded-2xl` (16px) for all primary cards.
2. **Buttons:**
   - Update `Button.tsx` variants to remove hard black shadows.
   - Implement `transition-all duration-300` for all hover states.
3. **Pillar Cards:**
   - Update Environmental, Social, and Governance score cards to use the frosted look with their respective category color tints at 10% opacity.

### Phase 4: Gamification & Data Viz
1. **Progress Bars:**
   - Use a semi-transparent track (`bg-emerald-500/5`) and a solid emerald fill with a slight outer glow (`shadow-[0_0_10px_#10b981]`).
2. **Recharts Theming:**
   - Update `EvolutionChart.tsx` and `ReportsPage.tsx` to use Area gradients that fade from `Emerald (0.3 opacity)` to `Transparent`.

### Phase 5: Quality Assurance
1. **Purple Audit:** Scan for any lingering violet/purple hexes or Tailwind classes.
2. **CEO Test:** Review on high-resolution displays to ensure text contrast and spacing feel "premium."
3. **Accessibility:** Verify contrast ratios for the Emerald text in both light and dark modes.

---

## 🛑 Forbidden Patterns
- **No Emojis:** Strictly use Lucide-React SVG icons.
- **No Violet:** Purple is banned; use Indigo or Emerald tints for accents if needed.
- **No Hard Shadows:** No neubrutalist offsets (e.g., `4px 4px 0 0`).
- **No Clutter:** Maintain high whitespace to signal "Enterprise Premium."
