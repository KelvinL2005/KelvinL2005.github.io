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

// The current page's nav link is marked in the HTML with aria-current="page",
// so it works even without JavaScript.
