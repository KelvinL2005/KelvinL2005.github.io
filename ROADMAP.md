# Portfolio Roadmap

**Direction:** a professional developer portfolio that tells the story of how I got into software, framed in a G1 Transformers style (chrome name, red/blue/gold palette, angled panels, the Ark backdrop).
**Rule:** personal touches stay only when they're part of the story. Content comes first. The theme lives in the frame: nav, hero, section titles and accents.
**Stack:** plain HTML/CSS/JS with [GSAP](https://gsap.com/) + ScrollTrigger from a CDN. There's no build step, so GitHub Pages serves the repo as-is.

Rules that apply everywhere:
- The page works and reads fine with JavaScript off. Animations are added on top.
- `prefers-reduced-motion` turns off all motion.
- Only animate `transform` and `opacity`.
- No phone number or other private details on the public site.

---

## Done
- [x] Layout: fixed nav with a mobile menu, hero, About, Journey, Projects, Skills, Contact.
- [x] Content from the 2026 résumé: education, experience, project details, skills and coursework.
- [x] **Journey timeline:** Counter-Strike 1.6 → first PC → Sansotei → first Java program → York Lassonde → web projects → next co-op.
- [x] Projects as short case studies (summary, key points, stack, code link).
- [x] Hero: availability badge (Winter 2028 co-op), clear role line, contact links.
- [x] Optimus in the hero floats and turns to face the cursor (`js/character.js`).
- [x] Animations: staggered hero intro, sections revealed on scroll, and a timeline line that draws as you scroll (`js/reveal.js`).
- [x] Typography: Russo One for the name and section titles, Inter for everything else.
- [x] Removed the Decepticon faction swap, transition bumper, reticle and blaster fire.

## Next
- [ ] Project screenshots or short GIFs for Pokemon Team Analyzer and VisualOS.
- [ ] Live demo links once the projects are deployed.
- [ ] Social preview image (`og:image`) and a new favicon.
- [ ] Shrink `assets/img/autobot.png` (245 KB).
- [ ] Lighthouse pass: aim for 90+ on performance and accessibility.
- [ ] Test on a real phone, Safari and Firefox.
- [ ] Update the README with a screenshot and a link to the live site.
