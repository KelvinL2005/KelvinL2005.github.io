// Mobile menu toggle
const toggle = document.querySelector(".hud__toggle");
const menu = document.getElementById("hud-menu");

function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
}

toggle.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
});

// Close the menu after picking a link or pressing Escape
menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
});

// Highlight the nav link for the section currently on screen
const links = [...menu.querySelectorAll("a")];
const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((link) => {
                const active = link.getAttribute("href") === `#${entry.target.id}`;
                link.classList.toggle("is-active", active);
                if (active) link.setAttribute("aria-current", "true");
                else link.removeAttribute("aria-current");
            });
        });
    },
    // A section counts as active when it crosses the middle band of the screen
    { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => observer.observe(section));
