"use strict";

const navLinks = [...document.querySelectorAll(".navbar .nav-link")];
const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href")));
const navigation = document.getElementById("main-navigation");
const siteHeader = document.querySelector(".site-header");
const menuButton = document.querySelector(".navbar-toggler");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.getElementById("current-year").textContent = new Date().getFullYear();

const headerLinks = siteHeader.querySelectorAll("a[href^='#']");

headerLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (!navigation.classList.contains("show")) return;

        navigation.addEventListener("hidden.bs.collapse", () => {
            const section = document.querySelector(link.getAttribute("href"));
            const heading = section.id === "about" ? document.getElementById("about-title") : section.querySelector("h1, h2");
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

const card = document.getElementById("businessCard");
const home = document.getElementById("home");
const about = document.getElementById("about");
const front = card.querySelector(".card-front");
const back = card.querySelector(".card-back");
const flipButton = document.getElementById("flip-card");
const flipLabel = document.getElementById("flip-label");
let flipPending = false;
let showingBack = false;

function updateCardFlip() {
    const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height"));
    const progress = Math.max(0, Math.min(1, (headerHeight - home.getBoundingClientRect().top) / about.offsetTop));
    const nextBack = progress >= 0.5;
    card.style.setProperty("--flip-angle", `${reducedMotion.matches ? (nextBack ? 180 : 0) : progress * 180}deg`);
    if (nextBack !== showingBack) {
        showingBack = nextBack;
        const hiddenFace = showingBack ? front : back;
        if (hiddenFace.contains(document.activeElement)) flipButton.focus({ preventScroll: true });
        front.inert = showingBack;
        back.inert = !showingBack;
        front.setAttribute("aria-hidden", String(showingBack));
        back.setAttribute("aria-hidden", String(!showingBack));
        flipLabel.textContent = showingBack ? "Scroll to explore" : "Scroll to meet me";
        flipButton.setAttribute("aria-label", showingBack ? "Continue to experience" : "Show the back of the business card");
    }
    flipPending = false;
}

function scheduleCardFlip() {
    if (flipPending) return;
    flipPending = true;
    requestAnimationFrame(updateCardFlip);
}

flipButton.addEventListener("click", () => {
    (showingBack ? document.getElementById("experience") : about).scrollIntoView();
});
window.addEventListener("scroll", scheduleCardFlip, { passive: true });
window.addEventListener("resize", scheduleCardFlip);
window.addEventListener("pageshow", scheduleCardFlip);
reducedMotion.addEventListener("change", scheduleCardFlip);
updateCardFlip();

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
    const x = (event.clientX - dragStartX) / (cardBounds.width / 2);
    const y = (event.clientY - dragStartY) / (cardBounds.height / 2);
    const clamp = (value) => Math.max(-1, Math.min(1, value));
    card.style.transform = `rotateX(${-clamp(y) * 30}deg) rotateY(${clamp(x) * 30}deg)`;
}

card.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || reducedMotion.matches || event.target.closest("a")) return;

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

function confettiShake(e) {
    const el = e.currentTarget;
    el.classList.remove("confetti-shake");
    void el.offsetWidth;
    el.classList.add("confetti-shake");
}

function confettiExplosion(e) {
    const clicked = e.target;

    const clickedRect = clicked.getBoundingClientRect();
    const startX = (clickedRect.left + clickedRect.right) / 2.0 / window.innerWidth;
    const startY = (clickedRect.top + clickedRect.bottom) / 2.0 / window.innerHeight;

    confettiShake(e);
    
    confetti({
        particleCount: 60,
        spread: 1000,
        startVelocity: 15,
        origin: { x: startX, y: startY },
        zIndex: 9999
    });
}

const confettiE = document.getElementById("confetti");
confettiE.addEventListener("click", confettiExplosion);
confettiE.addEventListener("animationend", () => {
    confettiE.classList.remove("confetti-shake");
});