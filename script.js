"use strict";

const navLinks = [...document.querySelectorAll(".navbar .nav-link")];
const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href")));
const navigation = document.getElementById("main-navigation");
const siteHeader = document.querySelector(".site-header");
const menuButton = document.querySelector(".navbar-toggler");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.getElementById("current-year").textContent = new Date().getFullYear();

const headerLinks = siteHeader.querySelectorAll('a[href^="#"]');

headerLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (!navigation.classList.contains("show")) return;

        navigation.addEventListener("hidden.bs.collapse", () => {
            const section = document.querySelector(link.getAttribute("href"));
            const heading = section.querySelector("h1, h2");
            heading.setAttribute("tabindex", "-1");
            heading.focus({ preventScroll: true });
            heading.addEventListener("blur", () => heading.removeAttribute("tabindex"), { once: true });
            
            section.scrollIntoView();
        }, { once: true });

        bootstrap.Collapse.getOrCreateInstance(navigation, { toggle: false }).hide();
    });
});

siteHeader.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("show")) {
        event.preventDefault();
        bootstrap.Collapse.getOrCreateInstance(navigation, { toggle: false }).hide();
        menuButton.focus();
    }
});

let scrollPending = false;

function updateActiveSection() {
    const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height"));
    let activeSection = sections[0];

    for (const section of sections) {
        if (section.getBoundingClientRect().top <= headerHeight + 100) activeSection = section;
    }

    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        activeSection = sections[sections.length - 1];
    }

    for (const link of navLinks) {
        const active = link.getAttribute("href") === `#${activeSection.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
    }

    scrollPending = false;
}

function scheduleNavigationUpdate() {
    if (scrollPending) return;
    scrollPending = true;
    window.requestAnimationFrame(updateActiveSection);
}

window.addEventListener("scroll", scheduleNavigationUpdate, { passive: true });
window.addEventListener("resize", scheduleNavigationUpdate);
window.addEventListener("pageshow", scheduleNavigationUpdate);
updateActiveSection();

// make links work when dragging
const card = document.getElementById("businessCard");
let dragPointerId = null;
let cardBounds;
let dragStartX = 0;
let dragStartY = 0;

function resetCard() {
    const pointerId = dragPointerId;
    dragPointerId = null;
    if (pointerId !== null && card.hasPointerCapture(pointerId)) {
        card.releasePointerCapture(pointerId);
    }
    card.classList.remove("is-dragging");
    card.style.transform = "";
}

function tiltCard(event) {
    // relative drag movement = awesome sauce
    const x = (event.clientX - dragStartX) / (cardBounds.width / 2);
    const y = (event.clientY - dragStartY) / (cardBounds.height / 2);
    const clamp = (value) => Math.max(-1, Math.min(1, value));
    card.style.transform = `perspective(1000px) rotateX(${-clamp(y) * 30}deg) rotateY(${clamp(x) * 30}deg)`;
}

card.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || reducedMotion.matches || event.target.closest("a")) return;

    // Prevent text/image dragging only
    event.preventDefault();
    cardBounds = card.getBoundingClientRect();
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    dragPointerId = event.pointerId;
    card.setPointerCapture(event.pointerId);
    card.classList.add("is-dragging");
});

card.addEventListener("pointermove", (event) => {
    if (event.pointerId === dragPointerId) tiltCard(event);
});

card.addEventListener("pointerup", resetCard);
card.addEventListener("pointercancel", resetCard);
card.addEventListener("lostpointercapture", resetCard);
window.addEventListener("blur", resetCard);
window.addEventListener("resize", resetCard);
reducedMotion.addEventListener("change", resetCard);
