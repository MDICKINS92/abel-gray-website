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

// Keep the full local coverage visible at the bottom of every page.
const siteCoverageMarkup = `
    <section class="site-coverage" aria-labelledby="site-coverage-title">
        <div class="container">
            <h2 id="site-coverage-title">Areas We Cover</h2>
            <p><strong>Buckinghamshire:</strong> Buckingham, Milton Keynes, Newport Pagnell, Olney, Castlethorpe, Haversham, Emberton, Weston Underwood, Ravenstone, Clifton Reynes, Gayhurst, Tyringham, Filgrave, North Crawley, Astwood, Little Brickhill, Woburn Sands, Wavendon, Whaddon, Nash, Winslow, Maids Moreton, Akeley, Leckhampstead, Thornborough, Thornton, Beachampton, Calverton, Stony Stratford, Swanbourne, Drayton Parslow, Cheddington, Mentmore, Slapton, Soulbury, Stewkley, Wing and Wingrave.</p>
            <p><strong>Bedfordshire:</strong> Bedford, Leighton Buzzard, Dunstable, Stanbridge, Billington, Ledburn, Milton Bryan, Husborne Crawley, Ridgmont, Aspley Guise, Marston Moretaine, Westoning, Harlington, Toddington, Chalgrave, Wingfield, Barton-le-Clay, Silsoe, Clophill, Maulden, Meppershall, Shefford, Clifton, Henlow, Stotfold and Arlesey.</p>
            <p><strong>Northamptonshire:</strong> Northampton, Kettering, Corby, Daventry, Brackley, Wellingborough, Irthlingborough, Rushden, Higham Ferrers, Finedon, Burton Latimer, Desborough, Rothwell, Geddington, Broughton, Isham, Earls Barton, Ecton, Mears Ashby, Sywell, Moulton, Brixworth, Pitsford, Chapel Brampton, Weedon, Bugbrooke, Nether Heyford and Harpole.</p>
            <p><strong>Thrapston area:</strong> Thrapston, Slipton, Oundle, Brigstock, Denford, Warmington, Cotterstock, Achurch, Woodford, Twywell, Fotheringhay, Aldwincle, Glapthorn, Deenethorpe, Titchmarsh, Islip, Ringstead, Great Addington, Little Addington, Sudborough, Lowick, Thorpe Waterville, Clopton, Barnwell, Pilton, Wadenhoe, Lilford, Stoke Doyle, Grafton Underwood, Cranford, Raunds, Chelveston and Hargrave.</p>
            <p><strong>Towcester area:</strong> Towcester, Paulerspury, Greens Norton, Silverstone, Blisworth, Stoke Bruerne, Cosgrove, Old Stratford, Roade, Yardley Gobion, Pury End, Grafton Regis, Hartwell, Whittlebury, Abthorpe, Wappenham, Blakesley, Woodend, Syresham, Bradden, Shutlanger, Alderton, Potterspury, Deanshanger, Wicken, Passenham, Ashton, Gayton, Tiffield, Easton Neston, Cold Higham, Pattishall, Astcote, Eastcote, Litchborough, Adstone, Maidford, Slapton, Wood Burcote and Caldecote.</p>
        </div>
    </section>`;

document.querySelectorAll('footer').forEach(footer => {
    footer.insertAdjacentHTML('beforebegin', siteCoverageMarkup);
});

// Provide the same company and privacy details in every existing footer.
document.querySelectorAll('footer .container').forEach(footer => {
    footer.innerHTML = '<p>&copy; <span id="copyright-year">' + new Date().getFullYear() + '</span> Abel Gray</p><p>Property investment, land and residential development across London, the Midlands and South East.</p><div class="footer-legal">Abel Gray is a trading name of <a href="https://find-and-update.company-information.service.gov.uk/company/14625321" target="_blank" rel="noopener">Abel Gray Homes Limited</a>, registered in England and Wales, company number 14625321. Registered office: 1st Floor, 14 Fulwood Place, London WC1V 6HZ. <a href="/privacy-policy">Privacy Policy</a></div>';
});

(function () {
    const cookieNotice = document.getElementById('cookie-notice');
    const cookieNoticeDismiss = document.getElementById('cookie-notice-dismiss');
    const cookieKey = 'abel-gray-cookie-notice-dismissed';

    if (!cookieNotice) return;

    function hasDismissedNotice() {
        try {
            if (window.localStorage.getItem(cookieKey) === 'true') return true;
        } catch (error) {
            // Use the first-party cookie fallback below when storage is restricted.
        }
        return document.cookie.split('; ').some(cookie => cookie === `${cookieKey}=true`);
    }

    function rememberDismissal() {
        try {
            window.localStorage.setItem(cookieKey, 'true');
        } catch (error) {
            // The cookie fallback still persists the choice when localStorage is blocked.
        }
        document.cookie = `${cookieKey}=true; max-age=31536000; path=/; SameSite=Lax`;
    }

    function hideNotice() {
        cookieNotice.hidden = true;
        cookieNotice.setAttribute('aria-hidden', 'true');
        cookieNotice.classList.add('is-hidden');
    }

    if (hasDismissedNotice()) {
        hideNotice();
    } else {
        cookieNotice.hidden = false;
        cookieNotice.removeAttribute('aria-hidden');
        cookieNotice.classList.remove('is-hidden');
    }

    if (cookieNoticeDismiss) {
        cookieNoticeDismiss.addEventListener('click', function () {
            rememberDismissal();
            hideNotice();
        });
    }
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
        "optimized_images/site-photo-1.jpg": ["pepys-lane-site-01", 600],
        "optimized_images/site-photo-2.jpg": ["pepys-lane-site-02", 600]
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
