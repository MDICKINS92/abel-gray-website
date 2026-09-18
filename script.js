// Auto-update footer copyright year
const copyrightYear = document.getElementById('copyright-year');
if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
}

// Replit injects Umami on published pages when analytics is enabled.
// Keep analytics optional and isolated so tracking can never break the site.
function trackAnalyticsEvent(name, data) {
    try {
        window.umami?.track(name, data);
        if (typeof window.gtag === 'function') {
            window.gtag('event', name, data);
        }
    } catch (error) {
        // Analytics must never interrupt a visitor action.
    }
}

const analyticsPage = window.location.pathname || '/';

document.querySelectorAll('.navbar').forEach(navbar => {
    const toggle = navbar.querySelector('.nav-toggle');
    const menu = navbar.querySelector('.nav-links');

    if (!toggle || !menu) return;

    function closeMenu(returnFocus = false) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        if (returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', function () {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
            closeMenu();
        } else {
            menu.classList.add('is-open');
            toggle.setAttribute('aria-expanded', 'true');
            toggle.setAttribute('aria-label', 'Close menu');
        }
    });

    menu.addEventListener('click', function (event) {
        if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            closeMenu(true);
        }
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 900) closeMenu();
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
    const contactNumberField = contactForm.querySelector('#contact-number');

    function validateContactNumber() {
        if (!contactNumberField) return true;

        const enteredNumber = contactNumberField.value.trim();
        if (!enteredNumber) {
            contactNumberField.setCustomValidity('');
            return !contactNumberField.required;
        }

        const compactNumber = enteredNumber.replace(/[\s()-]/g, '');
        const normalizedNumber = compactNumber.startsWith('+440')
            ? `+44${compactNumber.slice(4)}`
            : compactNumber;
        const isValid = /^(?:\+44\d{10}|0\d{10})$/.test(normalizedNumber);

        contactNumberField.setCustomValidity(isValid
            ? ''
            : 'Enter a valid UK contact number, such as 01908 870199 or +44 1908 870199.');
        return isValid;
    }

    if (contactNumberField) {
        contactNumberField.addEventListener('input', validateContactNumber);
        contactNumberField.addEventListener('blur', validateContactNumber);
    }

    contactForm.addEventListener('submit', function(e) {
        if (!validateContactNumber()) {
            e.preventDefault();
            contactNumberField.reportValidity();
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

        const sourceField = this.querySelector('input[name="enquiry_source"]');
        trackAnalyticsEvent('enquiry_form_submitted', {
            source: sourceField ? sourceField.value : 'website',
            page: analyticsPage
        });

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
    if (path.includes('sell-your-barn')) return 'land-barn';
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

    const contactNumberField = form.querySelector('#contact-number');
    if (contactNumberField) {
        const isLandEnquiry = enquirySource.toLowerCase().startsWith('land');
        contactNumberField.required = isLandEnquiry;
        contactNumberField.setAttribute('aria-required', isLandEnquiry ? 'true' : 'false');
    }
});

document.querySelectorAll('a[href*="#contact"]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    try {
        const url = new URL(href, window.location.href);
        const incomingSource = new URLSearchParams(window.location.search).get('source');
        if (incomingSource || !url.searchParams.has('source')) {
            url.searchParams.set('source', incomingSource || enquirySource);
        }
        link.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
    } catch (error) {
        // Leave an unparseable link unchanged.
    }
});

function scrollToPageHash(hash, behavior) {
    if (!hash || hash === '#') return false;

    let target;
    try {
        target = document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch (error) {
        return false;
    }
    if (!target) return false;

    if (hash.toLowerCase() === '#contact') {
        target = document.getElementById('enquiry-form') || target;
    }

    const header = document.querySelector('.navbar');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight - 16);
    window.scrollTo({ top: top, behavior: behavior });
    return true;
}

document.addEventListener('click', function (event) {
    const link = event.target.closest('a[href]');
    if (!link) return;

    let url;
    try {
        url = new URL(link.href, window.location.href);
    } catch (error) {
        return;
    }

    const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
    const targetPath = url.pathname.replace(/\/index\.html$/, '/');
    if (url.origin !== window.location.origin || targetPath !== currentPath || !url.hash) return;
    if (!document.getElementById(decodeURIComponent(url.hash.slice(1)))) return;

    event.preventDefault();
    window.history.pushState(null, '', `${url.pathname}${url.search}${url.hash}`);
    window.requestAnimationFrame(function () {
        scrollToPageHash(url.hash, 'smooth');
    });
});

function settleInitialHashPosition() {
    if (!window.location.hash) return;

    [0, 250, 1000].forEach(function (delay) {
        window.setTimeout(function () {
            window.requestAnimationFrame(function () {
                scrollToPageHash(window.location.hash, 'auto');
            });
        }, delay);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', settleInitialHashPosition);
} else {
    settleInitialHashPosition();
}

if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(settleInitialHashPosition).catch(function () {
        // The existing DOM and load retries still position the form.
    });
}

window.addEventListener('load', function () {
    window.requestAnimationFrame(function () {
        scrollToPageHash(window.location.hash, 'auto');
        window.setTimeout(function () {
            scrollToPageHash(window.location.hash, 'auto');
        }, 500);
    });
});

function analyticsLinkLocation(link) {
    if (link.closest('nav')) return 'navigation';
    if (link.closest('[data-project-card]')) return 'project_card';
    if (link.closest('footer')) return 'footer';
    return 'content';
}

document.addEventListener('click', function (event) {
    const link = event.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href') || '';
    const lowerHref = href.toLowerCase();
    const location = analyticsLinkLocation(link);

    if (lowerHref.startsWith('mailto:info@abelgray.co.uk')) {
        trackAnalyticsEvent('contact_method_clicked', {
            method: 'email',
            location: location,
            page: analyticsPage
        });
    } else if (lowerHref.startsWith('tel:')) {
        trackAnalyticsEvent('contact_method_clicked', {
            method: 'phone',
            location: location,
            page: analyticsPage
        });
    }

    if (href.includes('#contact')) {
        let source = enquirySource;
        try {
            source = new URL(link.href, window.location.href).searchParams.get('source') || source;
        } catch (error) {
            // Use the page-derived source when a link cannot be parsed.
        }
        trackAnalyticsEvent('enquiry_cta_clicked', {
            source: source,
            location: location,
            page: analyticsPage
        });
    }

    const projectCard = link.closest('[data-project-card]');
    const projectMatch = lowerHref.match(/^\/(pepys-lane|field-view-house|lindoe-meadows|ecl-mews)(?:[/?#]|$)/);
    if (projectMatch) {
        trackAnalyticsEvent('project_link_clicked', {
            project: projectCard ? projectCard.getAttribute('data-project-card') : projectMatch[1],
            location: location,
            page: analyticsPage
        });
    }
});

// Keep a compact, consistent coverage summary in every existing footer.
document.querySelectorAll('footer .container').forEach(footer => {
    footer.innerHTML = '<h2>Areas We Cover</h2>' +
        '<p>We buy land and residential development opportunities across Buckinghamshire, Bedfordshire and Northamptonshire.</p>' +
        '<p><a href="/sell-land-buckinghamshire">Buckinghamshire</a> · <a href="/sell-land-bedfordshire">Bedfordshire</a> · <a href="/sell-land-northamptonshire">Northamptonshire</a> · <a href="/sell-land-northamptonshire-thrapston">Thrapston area</a> · <a href="/sell-land-northamptonshire-towcester">Towcester area</a></p>' +
        '<p>Abel Gray, Milton Keynes · <a href="tel:01908870199">01908 870199</a> · <a href="mailto:info@abelgray.co.uk">info@abelgray.co.uk</a></p>' +
        '<div class="footer-legal">Abel Gray is a trading name of <a href="https://find-and-update.company-information.service.gov.uk/company/14625321" target="_blank" rel="noopener">Abel Gray Homes Limited</a>, registered in England and Wales, company number 14625321. Registered office: 1st Floor, 14 Fulwood Place, London WC1V 6HZ. <a href="/privacy-policy">Privacy Policy</a></div>';
});

(function () {
    const measurementId = 'G-1362FMBH8H';
    const adsId = 'AW-18444441444';
    const enquiryConversionId = 'AW-18444441444/6Cu5COj8ivwcEOSu_9pE';
    const consentKey = 'abel-gray-analytics-consent';
    let enquiryConversionSent = false;

    function readConsent() {
        try {
            const storedChoice = window.localStorage.getItem(consentKey);
            if (storedChoice) return storedChoice;
        } catch (error) {
            // Use the first-party cookie fallback below when storage is restricted.
        }

        const consentCookie = document.cookie.split('; ').find(cookie => cookie.startsWith(`${consentKey}=`));
        return consentCookie ? consentCookie.split('=')[1] : null;
    }

    function rememberConsent(choice) {
        try {
            window.localStorage.setItem(consentKey, choice);
        } catch (error) {
            // The cookie fallback still persists the choice when localStorage is blocked.
        }

        const secureAttribute = window.location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `${consentKey}=${choice}; max-age=31536000; path=/; SameSite=Lax${secureAttribute}`;
    }

    function loadGoogleAnalytics() {
        if (document.querySelector(`script[data-google-analytics="${measurementId}"]`)) return;

        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', measurementId, { anonymize_ip: true });
        window.gtag('config', adsId);

        const analyticsScript = document.createElement('script');
        analyticsScript.async = true;
        analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        analyticsScript.dataset.googleAnalytics = measurementId;
        analyticsScript.addEventListener('load', function () {
            if (!document.body.hasAttribute('data-enquiry-conversion') || enquiryConversionSent) return;
            enquiryConversionSent = true;
            window.gtag('event', 'conversion', { send_to: enquiryConversionId });
        }, { once: true });
        document.head.appendChild(analyticsScript);
    }

    function hideNotice(notice) {
        notice.hidden = true;
        notice.setAttribute('aria-hidden', 'true');
        notice.classList.add('is-hidden');
    }

    const existingChoice = readConsent();
    if (existingChoice === 'accepted') {
        loadGoogleAnalytics();
        return;
    }
    if (existingChoice === 'rejected') return;

    let cookieNotice = document.getElementById('cookie-notice');
    if (!cookieNotice) {
        cookieNotice = document.createElement('aside');
        cookieNotice.id = 'cookie-notice';
        cookieNotice.className = 'cookie-notice';
        cookieNotice.setAttribute('role', 'region');
        cookieNotice.setAttribute('aria-label', 'Cookie choices');
        document.body.appendChild(cookieNotice);
    }

    cookieNotice.innerHTML = '<p>Allow anonymous analytics to help us improve this website? <a href="/privacy-policy">Privacy policy</a></p>' +
        '<div class="cookie-notice-actions"><button type="button" class="cookie-reject" id="cookie-reject">No thanks</button><button type="button" id="cookie-accept">Allow</button></div>';
    cookieNotice.hidden = false;
    cookieNotice.removeAttribute('aria-hidden');
    cookieNotice.classList.remove('is-hidden');

    document.getElementById('cookie-accept').addEventListener('click', function () {
        rememberConsent('accepted');
        loadGoogleAnalytics();
        hideNotice(cookieNotice);
    });

    document.getElementById('cookie-reject').addEventListener('click', function () {
        rememberConsent('rejected');
        hideNotice(cookieNotice);
    });
})();

// Upgrade lazy-loaded legacy gallery images to responsive AVIF/WebP sources.
(function () {
    const responsiveImages = {
        "optimized_images/CGI_1_-_Rev_A_(Post)_1766488796939.jpg": ["pepys-lane-cgi-01", 1200],
        "optimized_images/CGI_3_1766488938408.jpg": ["ecl-mews-cgi-03", 1200],
        "optimized_images/CGI_4_-_RevA_(Post)_1766488809694.jpg": ["pepys-lane-cgi-04", 1200],
        "optimized_images/CGI_4_1766488930082.jpg": ["ecl-mews-cgi-04", 1200],
        "optimized_images/CGI_5_-_RevA_(Post)_1766488812018.jpg": ["pepys-lane-cgi-05", 1200],
        "optimized_images/CGI_8_-_RevA_(Post)_1766488815732.jpg": ["pepys-lane-cgi-08", 1200],
        "optimized_images/IMG_2045_1766489370012.jpg": ["pepys-lane-gallery-01", 800],
        "optimized_images/IMG_2057_1766489370012.jpg": ["pepys-lane-gallery-02", 800],
        "optimized_images/IMG_2060_1766489370012.jpg": ["pepys-lane-gallery-03", 800],
        "optimized_images/IMG_2958_1766489370012.jpg": ["pepys-lane-gallery-04", 800],
        "optimized_images/IMG_2977_1766489370012.jpg": ["pepys-lane-gallery-05", 800],
        "optimized_images/IMG_2984_1766489370012.jpg": ["pepys-lane-gallery-06", 800],
        "optimized_images/IMG_3003_1766489370012.jpg": ["pepys-lane-gallery-07", 800],
        "optimized_images/IMG_3478_1766489370012.jpg": ["pepys-lane-gallery-08", 800],
        "optimized_images/IMG_4064_1766489370012.jpg": ["pepys-lane-gallery-09", 800],
        "optimized_images/IMG_4435_1766515607723.jpg": ["journal-image-01", 800],
        "optimized_images/IMG_4570_1766489370012.jpg": ["pepys-lane-gallery-10", 800],
        "optimized_images/IMG_4711_1766510941330.jpg": ["journal-image-02", 800],
        "optimized_images/IMG_4713_1766510941330.jpg": ["journal-image-03", 800],
        "optimized_images/IMG_4720_1766510941330.jpg": ["journal-image-04", 800],
        "optimized_images/IMG_4721_1766510941330.jpg": ["journal-image-05", 800],
        "optimized_images/IMG_5159_1769547754433.jpeg": ["journal-image-06", 1600],
        "optimized_images/IMG_5480_2_1772141745788.jpeg": ["journal-image-07", 1200],
        "optimized_images/IMG_5484_1772141608532.jpeg": ["journal-image-08", 1200],
        "optimized_images/IMG_7706_1781961571620.jpeg": ["journal-image-09", 1600],
        "optimized_images/IMG_7811_1781961571620.jpeg": ["journal-image-10", 1600],
        "optimized_images/pepys-aster-front.jpg": ["pepys-lane-aster", 1448],
        "optimized_images/pepys-lily-rear.jpg": ["pepys-lane-lily", 1086],
        "optimized_images/pepys-peony-front.jpg": ["pepys-lane-peony", 1086],
        "optimized_images/site-photo-1.jpg": ["pepys-lane-site-01", 800],
        "optimized_images/site-photo-2.jpg": ["pepys-lane-site-02", 800]
    };

    function sourceSet(base, extension, maximum) {
        const widths = maximum <= 600 ? [480, 600] : maximum <= 800 ? [480, 800] : [480, 800, maximum];
        return widths.map(function (width) {
            return "optimized_images/responsive/" + base + "-" + width + "." + extension + " " + width + "w";
        }).join(", ");
    }

    document.querySelectorAll("img").forEach(function (image) {
        const source = image.getAttribute("src");
        const configuration = responsiveImages[source];
        if (!configuration || image.parentElement.tagName === "PICTURE") return;

        const base = configuration[0];
        const maximum = configuration[1];
        const picture = document.createElement("picture");
        const avif = document.createElement("source");
        const webp = document.createElement("source");
        const sizes = image.getAttribute("sizes") || "(max-width: 992px) 100vw, 50vw";

        avif.type = "image/avif";
        avif.srcset = sourceSet(base, "avif", maximum);
        avif.sizes = sizes;
        webp.type = "image/webp";
        webp.srcset = sourceSet(base, "webp", maximum);
        webp.sizes = sizes;
        picture.append(avif, webp);
        image.parentNode.replaceChild(picture, image);
        picture.appendChild(image);
    });
})();
