// The hero robot: turns to face the cursor, aims its blaster at it, and fires on click.
(() => {
    const svg = document.querySelector(".robot");
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Without GSAP or with reduced motion the robot just stands still, which is fine
    if (!svg || reduceMotion || !window.gsap) return;

    const rig = svg.querySelector(".robot__rig");
    const upper = svg.querySelector(".robot__upper");
    const head = svg.querySelector(".robot__head");
    const arm = svg.querySelector(".robot__arm");
    const blaster = svg.querySelector(".robot__blaster");
    const flash = svg.querySelector(".robot__flash");

    // Joint positions, in the SVG's own coordinates (see the comment in index.html)
    const CENTER_X = 200;
    const SHOULDER = { x: 250, y: 124 };
    const NECK = { x: 200, y: 108 };
    const MUZZLE = { x: 424, y: 124 };
    const MAX_ARM = 70; // degrees up or down, so the arm never bends through the body
    const MAX_HEAD = 12;
    const TURN_DEADZONE = 30; // stops it flipping back and forth when the cursor is right above it

    // svgOrigin sets each part's pivot point, like pinning a paper-doll joint
    gsap.set(arm, { svgOrigin: `${SHOULDER.x} ${SHOULDER.y}` });
    gsap.set(head, { svgOrigin: `${NECK.x} ${NECK.y}` });
    gsap.set(rig, { svgOrigin: `${CENTER_X} 0` });

    const turnArm = gsap.quickTo(arm, "rotation", { duration: 0.35, ease: "power3" });
    const turnHead = gsap.quickTo(head, "rotation", { duration: 0.5, ease: "power3" });

    // Idle "breathing" so it never looks frozen
    gsap.to(upper, { y: -3, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1 });

    let facing = 1; // 1 = facing right, -1 = facing left
    let pointer = null; // last known pointer position on screen
    let onScreen = true;

    new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
    }).observe(svg);

    // Convert a point on the screen (CSS pixels) into the SVG's coordinate system.
    // getScreenCTM() is the matrix that maps SVG units -> screen pixels, so its
    // inverse goes the other way. It already accounts for scaling and scrolling.
    function toSvg(x, y) {
        const point = new DOMPoint(x, y);
        return point.matrixTransform(svg.getScreenCTM().inverse());
    }

    function aim() {
        if (!pointer || !onScreen) return;
        const target = toSvg(pointer.x, pointer.y);

        // Turn around when the cursor moves to the other side
        const dx = target.x - CENTER_X;
        const newFacing = dx > TURN_DEADZONE ? 1 : dx < -TURN_DEADZONE ? -1 : facing;
        if (newFacing !== facing) {
            facing = newFacing;
            gsap.to(rig, { scaleX: facing, duration: 0.3, ease: "power2.inOut" });
        }

        // The robot is drawn facing right. When it's mirrored, mirror the target too,
        // so the maths below can always assume "facing right".
        const localX = facing === 1 ? target.x : 2 * CENTER_X - target.x;

        // atan2 gives the angle of the line from the shoulder to the target.
        // SVG's y axis points down, so a positive angle means "aim lower".
        const radians = Math.atan2(target.y - SHOULDER.y, localX - SHOULDER.x);
        const degrees = gsap.utils.clamp(-MAX_ARM, MAX_ARM, (radians * 180) / Math.PI);

        turnArm(degrees);
        turnHead(gsap.utils.clamp(-MAX_HEAD, MAX_HEAD, degrees * 0.35));
    }

    // Sentry mode: slowly sweep the blaster when nobody is moving the mouse
    let idle = null;
    let idleTimer = null;

    function startIdle() {
        idle = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut", duration: 2.2 } })
            .to(arm, { rotation: -35 })
            .to(head, { rotation: -8 }, "<");
    }

    function stopIdle() {
        idle?.kill();
        idle = null;
        idleTimer?.kill();
        idleTimer = gsap.delayedCall(4, startIdle);
    }

    function fire(x, y) {
        // Recoil: the blaster group slides backwards along the arm, then springs back
        gsap.fromTo(blaster, { x: -10 }, { x: 0, duration: 0.3, ease: "back.out(3)" });
        gsap.fromTo(flash,
            { opacity: 1, scale: 0.4, svgOrigin: `${MUZZLE.x} ${MUZZLE.y}` },
            { opacity: 0, scale: 1.6, duration: 0.25, ease: "power2.out" });

        // Where is the barrel on screen right now? Same matrix trick as toSvg, but forwards.
        // Using the blaster's own matrix includes the flip, arm rotation and recoil.
        const muzzle = new DOMPoint(MUZZLE.x, MUZZLE.y).matrixTransform(blaster.getScreenCTM());
        const length = Math.hypot(x - muzzle.x, y - muzzle.y);
        const angle = Math.atan2(y - muzzle.y, x - muzzle.x) * (180 / Math.PI);

        const bolt = document.createElement("div");
        bolt.className = "bolt";
        Object.assign(bolt.style, { left: `${muzzle.x}px`, top: `${muzzle.y}px`, width: `${length}px` });
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
            // On touch the arm starts from wherever it was, so let it swing round first
            gsap.delayedCall(0.3, fire, [event.clientX, event.clientY]);
        }
    });

    // Scrolling moves the robot under a still cursor, so re-aim, at most once per frame
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
