/* Studio Design System v1 — shared script. Identical on every site.
   Behaviour: mobile nav, scroll reveal, footer year, quote-form AJAX.
   ★ Per-company config lives in the CONFIG block below — nothing else
     in this file should change per site. */
(function () {
  "use strict";

  /* ★ CONFIG — replace per company ─────────────────────────────────────── */
  var FORMSUBMIT_ENDPOINT = "https://crm.newoodmillwork.com/api/intake/website/"; // company inbox
  /* ────────────────────────────────────────────────────────────────────── */

  /* Mobile nav */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* Footer year */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* Scroll reveal — gated so no-JS / no-IO keeps everything visible */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js-reveal");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px 240px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* Quote form — progressive enhancement over the native FormSubmit POST.
     Without JS the form still submits (full-page) to the same inbox. */
  var form = document.getElementById("quoteForm");
  var status = document.getElementById("formStatus");
  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.querySelector('[name="_honey"]').value) return; // honeypot
      var name = form.querySelector('[name="name"]').value.trim();
      var email = form.querySelector('[name="email"]').value.trim();
      if (!name || !email) {
        status.textContent = "Please add your name and email so we can reply.";
        status.className = "form-status is-error";
        return;
      }
      var data = {};
      new FormData(form).forEach(function (v, k) { if (k.charAt(0) !== "_") data[k] = v; });
      status.textContent = "Sending…";
      status.className = "form-status";
      fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error("send failed");
        form.reset();
        status.textContent = "Thanks — your message is in. We reply within 1–2 business days.";
        status.className = "form-status is-success";
      }).catch(function () {
        status.textContent = "Something went wrong sending — please call or email us directly.";
        status.className = "form-status is-error";
      });
    });
  }
})();
