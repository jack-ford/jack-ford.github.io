"use strict";

(() => {
    const storageKey = "personal-website-theme";
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    let preference = null;

    try {
        const savedTheme = localStorage.getItem(storageKey);
        if (savedTheme === "light" || savedTheme === "dark") preference = savedTheme;
    } catch {
        // The toggle probably still works if the browser blocks local storage lol
    }

    function applyTheme(theme) {
        document.documentElement.dataset.bsTheme = theme;
        document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#1a1a1a" : "#f7f6f2";

        const button = document.getElementById("theme-toggle");
        if (!button) return;

        const nextTheme = theme === "dark" ? "light" : "dark";
        button.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
        button.title = `Switch to ${nextTheme} mode`;
    }

    function currentTheme() {
        return preference ?? (systemTheme.matches ? "dark" : "light");
    }

    applyTheme(currentTheme());

    document.addEventListener("DOMContentLoaded", () => {
        applyTheme(currentTheme());

        document.getElementById("theme-toggle").addEventListener("click", () => {
            preference = document.documentElement.dataset.bsTheme === "dark" ? "light" : "dark";
            applyTheme(preference);

            try {
                localStorage.setItem(storageKey, preference);
            } catch {
                // idk about what happens here
            }
        });
    });

    systemTheme.addEventListener("change", () => {
        if (preference === null) applyTheme(currentTheme());
    });
})();
