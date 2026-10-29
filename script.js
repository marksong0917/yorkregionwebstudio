/* Studio Design System v1 — shared script. Identical on every site.
   Behaviour: mobile nav, scroll reveal, footer year, quote-form AJAX.
   ★ Per-company config lives in the CONFIG block below — nothing else
     in this file should change per site. */
(function () {
  "use strict";

  /* ★ CONFIG — replace per company ─────────────────────────────────────── */
  var FORMSUBMIT_ENDPOINT = "https://crm.newoodmillwork.com/api/intake/website/"; // form endpoint (Hub intake)
  var COMPANY_EMAIL = "marksong0000@gmail.com"; // shown if a send fails
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

  /* Plan cards: a plan's CTA scrolls to the form (href="#contact")
     with that plan preselected in the optional plan select. */
  document.querySelectorAll("[data-plan]").forEach(function (el) {
    el.addEventListener("click", function () {
      var sel = document.getElementById("qPlan");
      if (sel) sel.value = el.getAttribute("data-plan");
    });
  });

  /* Quote form — progressive enhancement over the native POST.
     Without JS the form still submits (full-page) to the same
     endpoint. The submit button disables while sending (no
     double-submits), and a failed send points at the company
     email — the only contact channel these sites publish. */
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
      var btn = form.querySelector('button[type="submit"]');
      var btnLabel = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      status.textContent = "Sending…";
      status.className = "form-status";
      fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error("send failed");
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = btnLabel; }
        status.textContent = "Thanks — we've received it. We reply within one business day.";
        status.className = "form-status is-success";
      }).catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = btnLabel; }
        status.textContent = COMPANY_EMAIL
          ? "Something went wrong sending — please email us directly at " + COMPANY_EMAIL + "."
          : "Something went wrong sending — please try again in a moment.";
        status.className = "form-status is-error";
      });
    });
  }
})();

/* Anti-bot render token (Hub 0.65): fetch a signed timestamp from
   the Hub and stamp it into every intake form on the page — the
   quote form's AJAX payload picks the field up from FormData (it
   does not start with "_"), the guide form carries it as a plain
   hidden field. The Hub silently drops submissions that arrive
   inhumanly fast or with a forged token. If the fetch fails the
   form still submits; the Hub's other layers (rate limit,
   duplicate suppression, content heuristics) still apply. */
(function () {
  var forms = document.querySelectorAll('form[action*="/api/intake/website/"]');
  if (!forms.length) return;
  var tok = forms[0].querySelector('[name="token"]');
  var action = forms[0].getAttribute("action") || "";
  if (!tok || !action) return;
  var url = action.replace("website/", "challenge/")
    + "?t=" + encodeURIComponent(tok.value);
  fetch(url).then(function (r) { return r.json(); }).then(function (j) {
    if (!j || !j.c) return;
    forms.forEach(function (f) {
      var inp = f.querySelector('[name="c"]');
      if (inp) inp.value = j.c;
    });
  }).catch(function () {});
})();
