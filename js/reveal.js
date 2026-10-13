// Entrance animations: the hero assembles on load, sections slide in as you scroll,
// and the journey timeline draws itself as you read down it.
(() => {
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Everything is visible by default, so with no GSAP or reduced motion we simply stop here
    if (reduceMotion || !window.gsap) return;

    // Hero: each line rises into place one after another (stagger), then the character arrives
    gsap.timeline({ defaults: { ease: "power3.out" } })
        .from("[data-intro]", { y: 24, opacity: 0, duration: 0.7, stagger: 0.08 })
        .from(".hero__robot", { x: 60, opacity: 0, duration: 1 }, 0.2);

    if (!window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    // Sections: hide them now, then reveal each group as it scrolls into view.
    // batch() groups elements that enter at the same moment so they stagger together.
    gsap.set("[data-reveal]", { y: 30, opacity: 0 });
    ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }),
    });

    // Journey line: tie its length to scroll position. "scrub" means the animation follows
    // the scrollbar instead of playing on its own clock, so scrolling back up rewinds it.
    const timeline = document.querySelector(".timeline");
    if (timeline) {
        timeline.style.setProperty("--progress", 0);
        ScrollTrigger.create({
            trigger: timeline,
            start: "top 70%",
            end: "bottom 60%",
            scrub: true,
            onUpdate: (self) => timeline.style.setProperty("--progress", self.progress.toFixed(3)),
        });
    }
})();
