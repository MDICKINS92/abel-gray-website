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

// Keep enquiry attribution consistent across project, land and commercial routes.
const enquirySource = (() => {
    const querySource = new URLSearchParams(window.location.search).get('source');
    if (querySource) return querySource;
    const path = window.location.pathname.toLowerCase();
    if (path.includes('pepys-lane')) return 'pepys-lane';
    if (path.includes('field-view')) return 'field-view-house';
    if (path.includes('lindoe-meadows')) return 'lindoe-meadows';
    if (path.includes('ecl-mews')) return 'ecl-mews';
    if (path.includes('sell-land') || path.includes('sell-your-land') || path.includes('locations')) return 'land';
    if (path.includes('commercial')) return 'commercial';
    return 'website';
})();

document.querySelectorAll('.contact-form').forEach(form => {
    let sourceField = form.querySelector('input[name="enquiry_source"]');
    if (!sourceField) {
        sourceField = document.createElement('input');
        sourceField.type = 'hidden';
        sourceField.name = 'enquiry_source';
        form.appendChild(sourceField);
    }
    sourceField.value = enquirySource;
});

document.querySelectorAll('a[href*="#contact"]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.includes('source=')) return;
    const separator = href.includes('?') ? '&' : '?';
    link.setAttribute('href', `${href.split('#')[0]}${separator}source=${encodeURIComponent(enquirySource)}#contact`);
});

// Provide the same company and privacy details in every existing footer.
document.querySelectorAll('footer .container').forEach(footer => {
    if (footer.querySelector('.footer-legal')) return;
    const legal = document.createElement('div');
    legal.className = 'footer-legal';
    legal.innerHTML = 'Abel Gray Homes Limited · Registered in England and Wales · Company No. 14625321 · Operating from Northamptonshire · <a href="/privacy-policy">Privacy Policy</a>';
    footer.appendChild(legal);
});
