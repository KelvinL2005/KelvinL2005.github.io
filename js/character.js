// The hero character: floats, turns to face the cursor and tilts its blaster toward it.
(() => {
    const char = document.querySelector(".char");
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Without GSAP or with reduced motion the character just stands there, which is fine
    if (!char || reduceMotion || !window.gsap) return;

    const rig = char.querySelector(".char__rig");
    const bob = char.querySelector(".char__bob");
    const aimer = char.querySelector(".char__aim");
    const pivot = char.querySelector(".char__point--pivot");
    const muzzle = char.querySelector(".char__point--muzzle");

    const MAX_TILT = 20; // degrees either way, beyond this the pose starts to look broken
    const TURN_DEADZONE = 40; // px either side of the centre before the character turns round

    const tilt = gsap.quickTo(aimer, "rotation", { duration: 0.4, ease: "power3" });

    // Idle floating
    gsap.to(bob, { y: -10, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1 });

    // The image points its blaster to the left. facing = 1 is as drawn, -1 is mirrored.
    let facing = 1;
    let turning = false;
    let pointer = null;
    let onScreen = true;

    new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
    }).observe(char);

    // The centre of an element's box on screen. The marker spans are zero-sized and sit
    // inside the transformed wrappers, so this gives their real position after any flip,
    // tilt or bob, with no maths of our own.
    function centerOf(el) {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }

    const toDegrees = (radians) => (radians * 180) / Math.PI;

    // Wrap an angle into -180..180 so "350° clockwise" becomes "10° anticlockwise"
    const wrap = (deg) => ((deg + 540) % 360) - 180;

    function aim() {
        if (!pointer || !onScreen) return;

        // Turn round when the cursor moves to the other side of the character
        const box = char.getBoundingClientRect();
        const dx = pointer.x - (box.left + box.width / 2);
        const newFacing = dx < -TURN_DEADZONE ? 1 : dx > TURN_DEADZONE ? -1 : facing;
        if (newFacing !== facing) {
            facing = newFacing;
            turning = true;
            gsap.to(rig, {
                scaleX: facing,
                duration: 0.35,
                ease: "power2.inOut",
                onComplete: () => {
                    turning = false;
                    aim();
                },
            });
        }
        // Mid-turn the image is squashed nearly flat, so the marker positions would give
        // nonsense angles. Wait for the turn to finish, then aim (onComplete above).
        if (turning) return;

        // Where the blaster points with no tilt, and where it needs to point
        const p = centerOf(pivot);
        const m = centerOf(muzzle);
        const currentTilt = gsap.getProperty(aimer, "rotation");
        const gunAngle = toDegrees(Math.atan2(m.y - p.y, m.x - p.x)) - currentTilt * facing;
        const targetAngle = toDegrees(Math.atan2(pointer.y - p.y, pointer.x - p.x));

        // When mirrored, the parent's scaleX(-1) reverses the tilt direction, so undo that
        const needed = wrap(targetAngle - gunAngle) * facing;
        tilt(gsap.utils.clamp(-MAX_TILT, MAX_TILT, needed));
    }

    // Only a real mouse steers the character. On touch screens it just floats.
    window.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse") return;
        pointer = { x: event.clientX, y: event.clientY };
        aim();
    });

    // Scrolling moves the character under a still cursor, so re-aim, at most once per frame
    let scrollQueued = false;
    window.addEventListener("scroll", () => {
        if (scrollQueued || !pointer) return;
        scrollQueued = true;
        requestAnimationFrame(() => {
            scrollQueued = false;
            aim();
        });
    }, { passive: true });
})();
