// Targeting reticle that trails the mouse and "locks on" to things you can click.
(() => {
    // Only for a real mouse (not touch), only if the visitor is fine with motion,
    // and only if GSAP loaded. Otherwise the normal cursor is all they get.
    const finePointer = matchMedia("(pointer: fine)").matches;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion || !window.gsap) return;

    const reticle = document.createElement("div");
    reticle.className = "reticle";
    reticle.setAttribute("aria-hidden", "true");
    reticle.innerHTML = `
        <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="22" cy="22" r="13"/>
            <path d="M22 0v9M22 35v9M0 22h9M35 22h9"/>
        </svg>`;
    document.body.appendChild(reticle);

    // Centre the reticle on the pointer instead of hanging off its top-left corner
    gsap.set(reticle, { xPercent: -50, yPercent: -50 });

    // quickTo makes one reusable tween per property. Calling moveX(300) retargets it
    // smoothly, which is much cheaper than creating a new tween on every mouse event.
    const moveX = gsap.quickTo(reticle, "x", { duration: 0.18, ease: "power3" });
    const moveY = gsap.quickTo(reticle, "y", { duration: 0.18, ease: "power3" });

    let visible = false;
    window.addEventListener("pointermove", (event) => {
        if (!visible) {
            // First move: jump straight there so it doesn't fly in from the corner
            gsap.set(reticle, { x: event.clientX, y: event.clientY });
            gsap.to(reticle, { opacity: 1, duration: 0.2 });
            visible = true;
        }
        moveX(event.clientX);
        moveY(event.clientY);
    });

    document.documentElement.addEventListener("pointerleave", () => {
        gsap.to(reticle, { opacity: 0, duration: 0.2 });
        visible = false;
    });

    // Lock on: spin 45° and grow when over something interactive
    const targets = "a, button, .card";
    let locked = null;

    document.addEventListener("pointerover", (event) => {
        const target = event.target.closest(targets);
        if (target === locked) return;
        locked = target;
        reticle.classList.toggle("is-locked", Boolean(target));
        gsap.to(reticle, {
            rotation: target ? 45 : 0,
            scale: target ? 1.35 : 1,
            duration: 0.25,
            ease: "back.out(2)",
        });
    });
})();
