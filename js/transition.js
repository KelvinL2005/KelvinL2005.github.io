// G1-style "bumper" transition for nav links: the faction symbol spins at the screen,
// flips to the other faction, the page jumps to the section behind it, and the
// symbol flies away. Each click alternates Autobot <-> Decepticon.
(() => {
    const root = document.documentElement;
    const links = document.querySelectorAll('.hud a[href^="#"]');
    const badge = document.querySelector(".hud__brand .insignia");
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = window.gsap && !reduceMotion && badge;

    let faction = "autobot";
    let playing = false;

    function swapFaction() {
        faction = faction === "autobot" ? "decepticon" : "autobot";
        // CSS does the rest: accent colours fade and the nav badge flips (see base.css)
        root.dataset.faction = faction;
    }

    function jumpTo(target, hash) {
        // "instant" overrides the smooth scrolling set in CSS, since the bumper hides the jump
        target.scrollIntoView({ behavior: "instant", block: "start" });
        history.pushState(null, "", hash);
        // Move keyboard focus too, so the next Tab continues from the new section
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
    }

    // Build the full-screen overlay once, reusing the badge's two images
    let bumper, burst, stage, insignia;
    if (animate) {
        bumper = document.createElement("div");
        bumper.className = "bumper";
        bumper.setAttribute("aria-hidden", "true");
        bumper.innerHTML = '<div class="bumper__burst"></div><div class="bumper__stage"></div>';
        burst = bumper.querySelector(".bumper__burst");
        stage = bumper.querySelector(".bumper__stage");
        insignia = badge.cloneNode(true);
        stage.appendChild(insignia);
        document.body.appendChild(bumper);
    }

    function playBumper(target, hash) {
        playing = true;
        // Which face is showing now: 0° is Autobot, 180° is Decepticon
        const start = faction === "autobot" ? 0 : 180;

        gsap.timeline({ onComplete: () => { playing = false; } })
            .set(bumper, { visibility: "visible" })
            .set(stage, { opacity: 1 })
            // 1. Burst fades in while the symbol spins in from far away
            .fromTo(burst, { opacity: 0, scale: 0.6, rotation: 0 },
                { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" })
            .fromTo(insignia, { scale: 0, rotationY: start - 360, rotationZ: -90 },
                { scale: 1, rotationY: start, rotationZ: 0, duration: 0.45, ease: "back.out(1.4)" }, "<")
            // 2. Flip to the other faction
            .to(insignia, { rotationY: start + 180, duration: 0.4, ease: "power2.inOut" })
            // 3. Halfway through the flip, while the screen is covered, swap and jump
            .call(() => {
                swapFaction();
                jumpTo(target, hash);
            }, null, "-=0.2")
            // 4. Symbol flies past the camera and the burst fades out. The fade goes on the
            //    stage, not the symbol: opacity on a 3D-flipped element flattens it and the
            //    wrong face shows through.
            .to(insignia, { scale: 4, duration: 0.3, ease: "power2.in" }, "+=0.1")
            .to(stage, { opacity: 0, duration: 0.3, ease: "power2.in" }, "<")
            .to(burst, { opacity: 0, duration: 0.3 }, "<0.05")
            .set(bumper, { visibility: "hidden" });

        // Slowly turn the speed lines the whole time
        gsap.to(burst, { rotation: 25, duration: 1.4, ease: "none" });
    }

    links.forEach((link) => {
        link.addEventListener("click", (event) => {
            const hash = link.getAttribute("href");
            const target = document.querySelector(hash);
            if (!target) return;
            event.preventDefault();
            if (playing) return;

            if (animate) {
                playBumper(target, hash);
            } else {
                // No animation: still swap factions, just without the show
                swapFaction();
                jumpTo(target, hash);
            }
        });
    });
})();
