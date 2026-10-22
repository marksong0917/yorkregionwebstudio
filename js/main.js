// Strict Mode JavaScript Execution
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Accessible Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    function closeNav(returnFocus) {
        if (navMenu) navMenu.classList.remove('active');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
            if (returnFocus) navToggle.focus();
        }
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!isExpanded));
            navMenu.classList.toggle('active');
        });

        // Escape closes the mobile menu and returns focus to the toggle
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeNav(true);
            }
        });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                closeNav(false);
            }
        });
    });

    // Pricing buttons pre-select the matching package in the contact form
    const packageSelect = document.getElementById('package');
    const packageCtas = document.querySelectorAll('.package-cta');
    packageCtas.forEach(cta => {
        cta.addEventListener('click', () => {
            const wanted = cta.getAttribute('data-package');
            if (packageSelect && wanted) {
                for (let i = 0; i < packageSelect.options.length; i++) {
                    if (packageSelect.options[i].value === wanted) {
                        packageSelect.selectedIndex = i;
                        break;
                    }
                }
            }
        });
    });

    // Web3Forms Asynchronous Contact Form Submission
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const result = document.getElementById('formResult');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const originalBtnText = submitBtn ? submitBtn.textContent : "Send Message";
            if (submitBtn) {
                submitBtn.textContent = "Sending...";
                submitBtn.disabled = true;
            }

            if (result) {
                result.style.display = 'block';
                result.style.color = '#334155';
                result.textContent = "Submitting your message...";
            }

            try {
                const formData = new FormData(form);
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    if (result) {
                        result.style.color = "#047857";
                        result.innerHTML = "&#10004; Thank you! Your message has been sent. We'll reply — usually the same business day.";
                    }
                    form.reset();
                } else {
                    if (result) {
                        result.style.color = "#b91c1c";
                        result.textContent = data.message || "Error submitting form. Please try again.";
                    }
                }
            } catch (error) {
                if (result) {
                    result.style.color = "#b91c1c";
                    result.textContent = "Connection error. Please call directly at (289) 500-5666.";
                }
            } finally {
                if (submitBtn) {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }
            }
        });
    }
});

    // ---- 2026 revamp: scrolled header + scroll reveal ----
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 8);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }
    const revealTargets = document.querySelectorAll(
        '.section-header, .process-card, .feature-card, .pricing-card, .offer-card, .faq-item');
    if ('IntersectionObserver' in window && revealTargets.length) {
        document.documentElement.classList.add('js-reveal');
        revealTargets.forEach((el) => el.classList.add('reveal'));
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
            });
        }, { threshold: 0.12 });
        revealTargets.forEach((el) => io.observe(el));
    }
