// Strict Mode JavaScript Execution
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Accessible Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!isExpanded));
            navMenu.classList.toggle('active');
        });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
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
                result.style.color = '#cbd5e1';
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
                        result.style.color = "#10b981";
                        result.innerHTML = "&#10004; Thank you! Your message has been sent directly to Mark.";
                    }
                    form.reset();
                } else {
                    if (result) {
                        result.style.color = "#ef4444";
                        result.textContent = data.message || "Error submitting form. Please try again.";
                    }
                }
            } catch (error) {
                if (result) {
                    result.style.color = "#ef4444";
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
