(function () {
    "use strict";

    /* ---------- Mobile nav ---------- */
    var navToggle = document.getElementById("navToggle");
    var primaryNav = document.getElementById("primaryNav");

    if (navToggle && primaryNav) {
        navToggle.addEventListener("click", function () {
            var open = primaryNav.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", open ? "true" : "false");
        });

        // Close the menu when a link is tapped
        primaryNav.addEventListener("click", function (e) {
            if (e.target.tagName === "A") {
                primaryNav.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* ---------- Terminal before/after tabs ---------- */
    var tabs = document.querySelectorAll(".term-tab");
    var panels = document.querySelectorAll(".terminal-body");

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            var target = tab.getAttribute("data-tab");

            tabs.forEach(function (t) {
                var active = t === tab;
                t.classList.toggle("is-active", active);
                t.setAttribute("aria-selected", active ? "true" : "false");
            });

            panels.forEach(function (panel) {
                panel.classList.toggle(
                    "is-active",
                    panel.getAttribute("data-panel") === target
                );
            });
        });
    });

    /* ---------- Install method picker ---------- */
    var installSelect = document.getElementById("installMethod");
    var installPanels = document.querySelectorAll(".install-panel");

    function showInstallMethod(method) {
        installPanels.forEach(function (panel) {
            var active = panel.getAttribute("data-install") === method;
            panel.hidden = !active;
            panel.classList.toggle("is-active", active);
        });
    }

    if (installSelect && installPanels.length) {
        showInstallMethod(installSelect.value);

        installSelect.addEventListener("change", function () {
            showInstallMethod(installSelect.value);
        });
    }

    /* ---------- Copy to clipboard ---------- */
    var toast = document.getElementById("toast");
    var toastTimer;

    function showToast() {
        if (!toast) return;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 1600);
    }

    function fallbackCopy(text) {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand("copy");
        } catch (e) {
            /* no-op */
        }
        document.body.removeChild(ta);
    }

    function getCopyText(container) {
        // Prefer the <code> content; strip the "$ " visual prefix from inline snippets.
        var codeEl = container.querySelector("code") || container.querySelector("pre");
        var text = codeEl ? codeEl.innerText : "";
        return text.replace(/\u00a0/g, " ").trim();
    }

    document.querySelectorAll("[data-copy]").forEach(function (container) {
        var btn = container.querySelector(".copy-btn");
        if (!btn) return;

        btn.addEventListener("click", function () {
            var text = getCopyText(container);
            if (!text) return;

            var done = function () {
                var original = btn.textContent;
                btn.classList.add("copied");
                btn.textContent = "Copied";
                showToast();
                setTimeout(function () {
                    btn.classList.remove("copied");
                    btn.textContent = original;
                }, 1400);
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(done, function () {
                    fallbackCopy(text);
                    done();
                });
            } else {
                fallbackCopy(text);
                done();
            }
        });
    });
})();
