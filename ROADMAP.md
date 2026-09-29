# Portfolio Roadmap

**Direction:** push the existing G1 Transformers theme (chrome, red/blue/gold, angled panels) further.
**Motion:** medium. An intro sequence, reveals on scroll, hover effects and a custom cursor effect.
**Stack:** plain HTML/CSS/JS with [GSAP](https://gsap.com/) + ScrollTrigger from a CDN. There is no build step, so GitHub Pages serves the repo as-is.

Rules that apply to every phase:
- The page must work and read fine with JavaScript off. Animations are added on top.
- `prefers-reduced-motion` turns off the intro, the cursor effect and scroll animations.
- The cursor effect is off on touch devices (`pointer: coarse`).
- Only animate `transform` and `opacity` so the page stays at 60fps.

---

## Phase 0: Cleanup and structure
- [ ] Replace the empty `images` file with an `assets/` folder (`assets/img/`, `assets/icons/`).
- [ ] Add `resume.pdf`, or remove the link until the PDF exists.
- [ ] Split the code into `css/` (`base.css`, `components.css`, `animations.css`) and `js/` (`main.js`, `cursor.js`, `intro.js`, `scroll.js`).
- [ ] Remove the "THIS SITE IS STILL IN PROGRESS" heading, or turn it into a styled banner.
- [ ] Add meta and Open Graph tags (description, preview image) and preload the Russo One font.

## Phase 1: Layout and static design (no animation yet)
- [ ] **Hero:** full-height chrome name, the red role tag, an SVG Autobot-style insignia (original artwork, not the trademarked logo) and a "scroll" indicator.
- [ ] **Nav:** a fixed HUD bar with angled buttons and an active-section highlight. On mobile it becomes a hamburger menu.
- [ ] **About:** a "bio panel" styled like a HUD readout, with room for a photo.
- [ ] **Projects:** a grid of cut-corner cards with tech-tag chips, GitHub and demo buttons, and a screenshot slot.
- [ ] **Skills:** grouped "power level" bars or chip clusters (Languages / Frameworks / Tools).
- [ ] **Contact:** a large call to action plus icon links (Email, LinkedIn, GitHub).
- [ ] **Footer:** the red|gold|blue divider.
- [ ] Make it responsive at 360px, 768px and 1280px or wider.

## Phase 2: Core animations (GSAP)
- [ ] **Intro / "transform" sequence** (about 1.5s, runs once per session): angled panels slide apart, the insignia assembles, then the chrome name wipes in with a sheen.
- [ ] **Scroll reveals:** section headers slide in along their angled clip-path, and cards stagger in from alternating sides.
- [ ] **Chrome sheen:** a highlight sweeps across the title periodically and when you hover it.
- [ ] **Skill bars** fill up when they scroll into view.
- [ ] **Nav:** a sliding red indicator follows the active section.

## Phase 3: Cursor effect ⭐
Pick one to build first. The others can be added later as toggles.
1. **Targeting reticle (recommended):** a HUD crosshair ring follows the cursor with easing and lags slightly behind. Over links and cards it locks on: the ring snaps to the element's bounds and turns red.
2. **Energon trail:** a short trail of glowing blue/gold particles drawn on a `<canvas>`, fading out over about 300ms.
3. **Magnetic elements:** buttons and cards lean toward the cursor, and cards get a 3D tilt with a glare.

How it's built: `js/cursor.js` uses `gsap.quickTo` for smooth following, a single `pointermove` listener and `requestAnimationFrame`. The system cursor stays visible so the page remains usable.

## Phase 4: Content and assets
- [ ] Add project screenshots or GIFs (VisualOS, Pokemon Team Analyzer, Poker).
- [ ] Take a photo or make an avatar for About.
- [ ] Add the resume PDF.
- [ ] Optional sections for later: an experience timeline and a light/dark toggle.

## Phase 5: Polish and launch
- [ ] Lighthouse: aim for 90+ on performance and accessibility.
- [ ] Check keyboard navigation, focus states and color contrast.
- [ ] Test in Chrome, Firefox, Safari and on a real phone.
- [ ] Update the README with a screenshot and a link to the live site.

---

## Proposed file layout
```
index.html
resume.pdf
css/  base.css  components.css  animations.css
js/   main.js   intro.js  scroll.js  cursor.js
assets/img/  assets/icons/  optimus_primeFavicon.png
```
