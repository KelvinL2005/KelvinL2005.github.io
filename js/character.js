// The hero character: turns to face the cursor, tilts its gun toward it, and fires on click.
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
    const flash = char.querySelector(".char__flash");

    const MAX_TILT = 20; // degrees either way, beyond this the pose starts to look broken
    const TURN_DEADZONE = 40; // px either side of the centre before the character turns round

    const tilt = gsap.quickTo(aimer, "rotation", { duration: 0.4, ease: "power3" });

    // Idle floating
    gsap.to(bob, { y: -10, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1 });

    // The image points its gun to the left. facing = 1 is as drawn, -1 is mirrored.
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

        // Where the gun points with no tilt, and where it needs to point
        const p = centerOf(pivot);
        const m = centerOf(muzzle);
        const currentTilt = gsap.getProperty(aimer, "rotation");
        const gunAngle = toDegrees(Math.atan2(m.y - p.y, m.x - p.x)) - currentTilt * facing;
        const targetAngle = toDegrees(Math.atan2(pointer.y - p.y, pointer.x - p.x));

        // When mirrored, the parent's scaleX(-1) reverses the tilt direction, so undo that
        const needed = wrap(targetAngle - gunAngle) * facing;
        tilt(gsap.utils.clamp(-MAX_TILT, MAX_TILT, needed));
    }

    // Sentry mode: slowly sweep the gun when nobody is moving the mouse
    let idle = null;
    let idleTimer = null;

    function startIdle() {
        idle = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut", duration: 2.4 } })
            .fromTo(aimer, { rotation: -8 }, { rotation: 8 });
    }

    function stopIdle() {
        idle?.kill();
        idle = null;
        idleTimer?.kill();
        idleTimer = gsap.delayedCall(4, startIdle);
    }

    function fire(x, y) {
        // Recoil: kick the gun upward a little, then settle back
        gsap.fromTo(bob, { rotation: 0 }, {
            keyframes: [{ rotation: 3 * facing, duration: 0.06 }, { rotation: 0, duration: 0.3, ease: "back.out(3)" }],
            transformOrigin: "50% 50%",
        });
        gsap.fromTo(flash, { opacity: 1, scale: 0.4 }, { opacity: 0, scale: 1.6, duration: 0.25, ease: "power2.out" });

        const start = centerOf(muzzle);
        const length = Math.hypot(x - start.x, y - start.y);
        const angle = toDegrees(Math.atan2(y - start.y, x - start.x));

        const bolt = document.createElement("div");
        bolt.className = "bolt";
        Object.assign(bolt.style, { left: `${start.x}px`, top: `${start.y}px`, width: `${length}px` });
        document.body.appendChild(bolt);

        gsap.timeline({ onComplete: () => bolt.remove() })
            .fromTo(bolt, { rotation: angle, scaleX: 0 }, { scaleX: 1, duration: 0.12, ease: "none" })
            .to(bolt, { opacity: 0, duration: 0.2 });

        const impact = document.createElement("div");
        impact.className = "impact";
        Object.assign(impact.style, { left: `${x}px`, top: `${y}px` });
        document.body.appendChild(impact);

        gsap.fromTo(impact,
            { scale: 0.2, opacity: 1 },
            { scale: 1.6, opacity: 0, duration: 0.4, delay: 0.1, ease: "power2.out", onComplete: () => impact.remove() });
    }

    window.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse") return;
        pointer = { x: event.clientX, y: event.clientY };
        stopIdle();
        aim();
    });

    window.addEventListener("pointerdown", (event) => {
        if (!onScreen || event.button !== 0) return;
        pointer = { x: event.clientX, y: event.clientY };
        stopIdle();
        aim();
        if (event.pointerType === "mouse") {
            fire(event.clientX, event.clientY);
        } else {
            // On touch the gun starts from wherever it was, so let it swing round first
            gsap.delayedCall(0.35, fire, [event.clientX, event.clientY]);
        }
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

    startIdle();
})();
