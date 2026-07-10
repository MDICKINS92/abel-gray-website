// Auto-update footer copyright year
const copyrightYear = document.getElementById('copyright-year');
if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// CTA Button click handler
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', function() {
        const targetSection = document.querySelector('#homes') || document.querySelector('#developments');
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Record page load time for time-based spam check
const formLoadedField = document.getElementById('form_loaded');
if (formLoadedField) {
    formLoadedField.value = Date.now().toString();
}

// Contact form submission handled by Web3Forms with hCaptcha spam protection
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {

        // Honeypot checks — hidden fields bots tend to fill
        const websiteField = this.querySelector('input[name="website"]');
        const phoneAltField = this.querySelector('input[name="phone_number"]');
        const companyField = this.querySelector('input[name="company"]');
        if ((websiteField && websiteField.value) ||
            (phoneAltField && phoneAltField.value) ||
            (companyField && companyField.value)) {
            e.preventDefault();
            return false;
        }

        // Time-based check — reject if submitted in under 3 seconds
        const loadedAt = parseInt(formLoadedField ? formLoadedField.value : '0', 10);
        if (loadedAt && (Date.now() - loadedAt) < 3000) {
            e.preventDefault();
            return false;
        }

        // hCaptcha check — must be completed
        const hCaptchaResponse = this.querySelector('textarea[name="h-captcha-response"]');
        if (!hCaptchaResponse || !hCaptchaResponse.value.trim()) {
            e.preventDefault();
            alert('Please complete the security check to send your enquiry.');
            return false;
        }

        const button = this.querySelector('button[type="submit"]');
        button.textContent = 'Sending...';
        button.disabled = true;
    });
}

// Blog subscribe form
const blogSubscribe = document.querySelector('.blog-subscribe');
if (blogSubscribe) {
    blogSubscribe.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        alert('Thank you for subscribing! We\'ll send updates to ' + email);
        this.reset();
    });
}
