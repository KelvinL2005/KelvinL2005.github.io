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
- [x] Replace the empty `images` file with an `assets/` folder (`assets/img/`, `assets/icons/`).
- [x] Add `resume.pdf`, or remove the link until the PDF exists. (Placeholder button for now)
- [x] Split the code into `css/` (`base.css`, `components.css`, `animations.css`) and `js/` (`main.js`, `cursor.js`, `intro.js`, `scroll.js`).
- [x] Remove the "THIS SITE IS STILL IN PROGRESS" heading, or turn it into a styled banner.
- [x] Add meta and Open Graph tags (description, preview image) and preload the Russo One font.

## Phase 1: Layout and static design (no animation yet)
- [x] **Hero:** full-height chrome name, the red role tag, an SVG Autobot-style insignia (original artwork, not the trademarked logo) and a "scroll" indicator.
- [x] **Nav:** a fixed HUD bar with angled buttons and an active-section highlight. On mobile it becomes a hamburger menu.
- [x] **About:** a "bio panel" styled like a HUD readout, with room for a photo.
- [x] **Projects:** a grid of cut-corner cards with tech-tag chips, GitHub and demo buttons, and a screenshot slot.
- [x] **Skills:** grouped "power level" bars or chip clusters (Languages / Frameworks / Tools).
- [x] **Contact:** a large call to action plus icon links (Email, LinkedIn, GitHub).
- [x] **Footer:** the red|gold|blue divider.
- [x] Make it responsive at 360px, 768px and 1280px or wider.

## Phase 2: Core animations (GSAP)
- [ ] **Intro / "transform" sequence** (about 1.5s, runs once per session): angled panels slide apart, the insignia assembles, then the chrome name wipes in with a sheen.
- [ ] **Scroll reveals:** section headers slide in along their angled clip-path, and cards stagger in from alternating sides.
- [ ] **Chrome sheen:** a highlight sweeps across the title periodically and when you hover it.
- [ ] **Skill bars** fill up when they scroll into view.
- [ ] **Nav:** a sliding red indicator follows the active section.

## Phase 3: Cursor effect ⭐ (done)
- [x] **Aiming robot:** an original SVG mech in the hero turns to face the cursor and aims its blaster at it (`js/robot.js`).
- [x] **Fire on click:** recoil, a muzzle flash, and a bolt from the barrel to the click point with an impact ring.
- [x] **Sentry mode:** after 4s without mouse movement (and always on touch screens), it sweeps its blaster. On touch, tapping makes it aim and fire.
- [x] **Targeting reticle:** it trails the mouse and locks on (turns red, rotates) over links, buttons and cards (`js/cursor.js`).
- [ ] Later: a small robot docked in a corner that keeps tracking after you scroll past the hero.
- [ ] Later: replace the favicon with the new robot.

## Phase 3b: Faction transitions (done)
- [x] The nav badge shows the faction symbol and flips like a coin (`.insignia` in `css/components.css`).
- [x] **Bumper on nav clicks:** the symbol spins in over speed lines, flips Autobot to Decepticon (or back), the page jumps, then the symbol flies out (`js/transition.js`).
- [x] **Faction colour swap:** accents fade between Autobot red and Decepticon purple via `@property` variables (`css/base.css`).
- [x] Real Autobot/Decepticon insignias (black background cut out, squared).
- [x] **G1 backdrop:** painted Ark crash-site scene fixed behind the page, crossfading to the dusk version for Decepticon.
- [ ] **Optimus / Megatron:** replace the SVG robot with detailed character art that swaps with the faction (waiting on PNGs).

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
