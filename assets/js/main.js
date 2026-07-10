// Initialize AOS
AOS.init({
    duration: 900,
    once: true,      
    offset: 80,
    easing: 'ease-out-cubic'
});

function initHeader() {
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const drawer = document.getElementById('mobile-drawer');

    if (!header || !hamburger || !drawer) return;

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });

    const currentPage = location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-links a, .mobile-drawer a').forEach(link => {
        const href = link.getAttribute('href');

        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    hamburger.addEventListener('click', () => {
        const open = drawer.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    });

    drawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            drawer.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', e => {
        if (!header.contains(e.target) && drawer.classList.contains('open')) {
            drawer.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

document.addEventListener('headerLoaded', initHeader);


(function () {
  const section = document.querySelector('.hiw-section');
  if (!section) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    section.classList.add('in-view');
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add('in-view');
        observer.disconnect(); 
      }
    },
    { threshold: 0.25 }
  );

  observer.observe(section);
})();


// ==================== SERVICE AREAS PAGE ====================


// ---- FAQ Accordion ----
function initFAQ() {
    const items = document.querySelectorAll('.sa-faq-item');
    if (!items.length) return;

    items.forEach(item => {
        const btn = item.querySelector('.sa-faq-q');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all others
            items.forEach(i => {
                i.classList.remove('open');
                i.querySelector('.sa-faq-q')?.setAttribute('aria-expanded', 'false');
            });

            // Toggle clicked
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}


// ---- Stats Counter Animation ----
function animateCounter(el, target, duration = 1500) {
    let start = null;
    const startVal = 0;

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * (target - startVal) + startVal);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    }

    requestAnimationFrame(step);
}

function initStatsCounters() {
    const statNums = document.querySelectorAll('.sa-stat-num[data-target]');
    if (!statNums.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target, 10);
                    animateCounter(el, target);
                    observer.unobserve(el);
                }
            });
        },
        { threshold: 0.5 }
    );

    statNums.forEach(el => observer.observe(el));
}


// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
    initStatsCounters();
});

// ==================== SCROLL INDICATOR ====================

// function initScrollIndicator() {
//     const indicator = document.getElementById('scrollIndicator');
//     const progressBar = document.getElementById('scrollProgress');
//     const scrollBtn = document.getElementById('scrollBtn');
//     const scrollText = document.getElementById('scrollText');

//     if (!indicator || !progressBar || !scrollBtn || !scrollText) return;

//     let hideTimer;
//     let lastScrollY = window.scrollY;
//     let scrollDirection = 'down';

//     const SHOW_AFTER = window.innerHeight * 0.8;
//     const HIDE_DELAY = 5000;

//     function updateProgress() {
//         const scrollTop = window.scrollY;
//         const docHeight =
//             document.documentElement.scrollHeight -
//             document.documentElement.clientHeight;

//         const progress =
//             docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

//         progressBar.style.height = `${Math.min(progress, 100)}%`;
//     }

//     function showIndicator() {
//         if (window.scrollY < SHOW_AFTER) return;

//         indicator.classList.add('visible');

//         clearTimeout(hideTimer);

//         hideTimer = setTimeout(() => {
//             indicator.classList.remove('visible');
//         }, HIDE_DELAY);
//     }

//     function updateDirection() {
//         const currentScroll = window.scrollY;

//         if (currentScroll > lastScrollY + 5) {
//             scrollDirection = 'down';
//             scrollText.textContent = 'Scroll Down';
//         }
//         else if (currentScroll < lastScrollY - 5) {
//             scrollDirection = 'up';
//             scrollText.textContent = 'Scroll Up';
//         }

//         lastScrollY = currentScroll;
//     }

//     function handleVisibility() {
//         if (window.scrollY >= SHOW_AFTER) {
//             showIndicator();
//         } else {
//             indicator.classList.remove('visible');
//         }
//     }

//     scrollBtn.addEventListener('click', () => {
//         if (scrollDirection === 'up') {
//             window.scrollTo({
//                 top: 0,
//                 behavior: 'smooth'
//             });
//         } else {
//             window.scrollTo({
//                 top: window.scrollY + window.innerHeight,
//                 behavior: 'smooth'
//             });
//         }
//     });

//     window.addEventListener('scroll', () => {
//         updateProgress();
//         updateDirection();
//         handleVisibility();
//     }, { passive: true });

//     updateProgress();
//     handleVisibility();
// }

// document.addEventListener('DOMContentLoaded', initScrollIndicator);


// ==================== SCROLL INDICATOR ====================

function initScrollIndicator() {
    const indicator = document.getElementById('scrollIndicator');
    const progressBar = document.getElementById('scrollProgress');
    const scrollBtn = document.getElementById('scrollBtn');
    const scrollText = document.getElementById('scrollText');

    if (!indicator || !progressBar || !scrollBtn || !scrollText) return;

    let hideTimer;
    let lastScrollY = window.scrollY;

    function showIndicator() {
        indicator.classList.add('visible');

        clearTimeout(hideTimer);

        hideTimer = setTimeout(() => {
            indicator.classList.remove('visible');
        }, 5000); // Hide after 5 seconds
    }

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress =
            docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        progressBar.style.height = `${Math.min(progress, 100)}%`;
    }

    function updateDirection() {
        const currentScroll = window.scrollY;
        const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        // Near bottom
        if (currentScroll >= docHeight - 200) {
            scrollText.textContent = 'Scroll Up';
        }
        // Scrolling up
        else if (currentScroll < lastScrollY) {
            scrollText.textContent = 'Scroll Up';
        }
        // Scrolling down
        else {
            scrollText.textContent = 'Scroll Down';
        }

        lastScrollY = currentScroll;
    }

    function shouldShowIndicator() {
        // Show only after user reaches second section
        return window.scrollY > 350;
    }

    function handleScroll() {
        updateProgress();
        updateDirection();

        if (shouldShowIndicator()) {
            showIndicator();
        } else {
            indicator.classList.remove('visible');
        }
    }

    // Button click
    scrollBtn.addEventListener('click', () => {

        const direction = scrollText.textContent;

        if (direction === 'Scroll Up') {

            window.scrollBy({
                top: -window.innerHeight,
                behavior: 'smooth'
            });

        } else {

            window.scrollBy({
                top: window.innerHeight,
                behavior: 'smooth'
            });

        }

    });

    // Scroll event
    window.addEventListener('scroll', handleScroll, {
        passive: true
    });

    // Initial state
    updateProgress();
    updateDirection();

    if (window.scrollY > 350) {
        showIndicator();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', initScrollIndicator);









// ==================== SERVICES DATA ====================
const services = [
    { icon: "fas fa-exclamation-triangle", title: "Emergency Plumbing",       desc: "24/7 rapid response for burst pipes, floods, and urgent plumbing failures.",  slug: "emergency-plumbing"      },
    { icon: "fas fa-bath",                 title: "Drain & Sewer Cleaning",   desc: "Clear stubborn clogs and keep your drains flowing freely.",                    slug: "drain-sewer-cleaning"    },
    { icon: "fas fa-tint",                 title: "Leak Detection & Repair",  desc: "Fast, precise leak location and repair before damage spreads.",                slug: "leak-detection-repair"   },
    { icon: "fas fa-tools",                title: "Pipe Repair & Replacement", desc: "Expert repair and full repiping for homes and commercial properties.",        slug: "pipe-repair-replacement" },
    { icon: "fas fa-toilet",               title: "Toilet Installation & Repair", desc: "Reliable toilet service — installations, repairs, and replacements.",      slug: "toilet-installation"     },
    { icon: "fas fa-faucet",               title: "Faucet & Fixture Repair",  desc: "All types of fixture work, from dripping faucets to full replacements.",      slug: "faucet-fixture-repair"   },
    { icon: "fas fa-shower",               title: "Shower & Tub Installation", desc: "Beautiful bathroom upgrades installed cleanly and correctly.",                slug: "shower-tub-installation" },
    { icon: "fas fa-fire",                 title: "Water Heater Services",    desc: "Installation, repair, and replacement of tank and tankless water heaters.",    slug: "water-heater-services"   },
    { icon: "fas fa-building",             title: "Commercial Plumbing",      desc: "Comprehensive plumbing for businesses, hotels, restaurants, and multi-units.", slug: "commercial-plumbing"     }
];

// ==================== RENDER ====================
function renderServices() {
    const grid = document.getElementById('services-grid');
    if (!grid) return;

    grid.innerHTML = services.map((service, index) => `
        <div class="svc-card" data-aos="fade-up" data-aos-delay="${index * 70}">
            <div class="svc-icon-wrap">
                <i class="${service.icon}"></i>
            </div>
            <div class="svc-card-body">
                <h3>${service.title}</h3>
                <p>${service.desc}</p>
            </div>
            <a href="services.html#${service.slug}" class="svc-link">
                Learn more <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', renderServices);


// ==================== TESTIMONIALS ====================

const testimonials = [
    {
        text: "They arrived within 30 minutes for a burst pipe emergency. Professional, clean, and fair pricing. Saved my kitchen!",
        name: "Maria Rodriguez",
        location: "South Beach, Miami",
        photo: "assets/images/testimonial_img.webp"
    },
    {
        text: "Best plumber I've worked with in Miami Beach. Fixed our water heater the same day and explained everything clearly.",
        name: "David Thompson",
        location: "North Miami Beach",
        photo: "assets/images/testimonial_img.webp"
    },
    {
        text: "Used them for a complete bathroom remodel. Excellent workmanship, great communication, and everything finished on schedule.",
        name: "Elena Vargas",
        location: "Bal Harbour",
        photo: "assets/images/testimonial_img.webp"
    }
];

let currentIndex = 0;
let autoSlide;
let isMobile = window.innerWidth < 768;

// ---- Helpers ----

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function buildCard(t) {
    const avatarHTML = t.photo
        ? `<img src="${t.photo}" alt="${t.name}" class="testi-photo" onerror="this.replaceWith(buildAvatarEl('${getInitials(t.name)}'))">`
        : `<div class="testi-avatar">${getInitials(t.name)}</div>`;

    return `
        <div class="testi-card">
            <span class="testi-quote-mark" aria-hidden="true">"</span>
            <p class="testi-text">${t.text}</p>
            <div class="testi-stars">
                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                <i class="fas fa-star"></i><i class="fas fa-star"></i>
            </div>
            <div class="testi-author">
                ${avatarHTML}
                <div class="testi-author-info">
                    <span class="testi-name">${t.name}</span>
                    <span class="testi-location">
                        <i class="fas fa-map-marker-alt"></i> ${t.location}
                    </span>
                </div>
            </div>
        </div>
    `;
}

// Fallback avatar element builder (called from onerror inline)
function buildAvatarEl(initials) {
    const el = document.createElement('div');
    el.className = 'testi-avatar';
    el.textContent = initials;
    return el;
}
window.buildAvatarEl = buildAvatarEl;

// ---- Render ----

function renderTestimonials() {
    const track = document.getElementById('testimonial-slider');
    if (!track) return;

    track.innerHTML = testimonials.map(t => buildCard(t)).join('');
    buildDots();
    updateSlider();
}

// ---- Dots ----

function buildDots() {
    const dotsWrap = document.getElementById('testi-dots');
    if (!dotsWrap) return;

    dotsWrap.innerHTML = testimonials.map((_, i) => `
        <button class="testi-dot${i === 0 ? ' active' : ''}" aria-label="Go to review ${i + 1}"></button>
    `).join('');

    dotsWrap.querySelectorAll('.testi-dot').forEach((dot, i) => {
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateSlider();
            resetAutoSlide();
        });
    });
}

function updateDots() {
    document.querySelectorAll('.testi-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

// ---- Slider movement (mobile only) ----

function updateSlider() {
    if (!isMobile) return;

    const track = document.getElementById('testimonial-slider');
    if (!track) return;

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    updateDots();
}

// ---- Navigation ----

function nextSlide() {
    currentIndex = (currentIndex + 1) % testimonials.length;
    updateSlider();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    updateSlider();
}

function startAutoSlide() {
    autoSlide = setInterval(nextSlide, 6000);
}

function resetAutoSlide() {
    clearInterval(autoSlide);
    startAutoSlide();
}


function handleResize() {
    const wasDesktop = !isMobile;
    isMobile = window.innerWidth < 768;

    const track = document.getElementById('testimonial-slider');
    const controls = document.getElementById('testi-controls');

    if (track && controls) {
        if (!isMobile) {
            track.style.transform = '';
            controls.style.display = 'none';
            clearInterval(autoSlide);
        } else {
            controls.style.display = '';
            updateSlider();
            if (wasDesktop) startAutoSlide();
        }
    }
}

// ---- Init ----

function initTestimonials() {
    renderTestimonials();

    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

    if (isMobile) startAutoSlide();

    window.addEventListener('resize', handleResize, { passive: true });

    const sliderWrap = document.querySelector('.testi-slider-wrap');
    if (sliderWrap) {
        let touchStartX = 0;
        sliderWrap.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        sliderWrap.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                diff > 0 ? nextSlide() : prevSlide();
                resetAutoSlide();
            }
        }, { passive: true });
    }
}

document.addEventListener('DOMContentLoaded', initTestimonials);

// ==================== FAQ ACCORDION ====================

const faqs = [
    {
        q: "Do you offer 24/7 emergency service?",
        a: "Yes! We provide true 24/7 emergency plumbing service across Miami Beach and Miami-Dade County. No after-hours fees — ever."
    },
    {
        q: "How quickly can you arrive?",
        a: "For emergencies, we typically arrive within 30–90 minutes depending on your location. We pride ourselves on fast response times."
    },
    {
        q: "Do you offer free estimates?",
        a: "Yes. We provide free estimates for all non-emergency work. Emergency calls include a transparent upfront diagnostic fee."
    },
    {
        q: "What areas do you serve?",
        a: "We serve all of Miami Beach, South Beach, North Miami Beach, Surfside, Bal Harbour, Sunny Isles, Downtown Miami, Brickell, and the entire Miami-Dade County."
    },
    {
        q: "Are you licensed and insured?",
        a: "Absolutely. All our technicians are fully licensed, bonded, and insured for your complete peace of mind."
    },
    {
        q: "Do you work on commercial buildings?",
        a: "Yes. We provide full commercial plumbing services for hotels, restaurants, offices, property managers, and multi-unit buildings."
    }
];

function renderFAQs() {
    const container = document.getElementById('faq-accordion');
    if (!container) return;

    container.innerHTML = faqs.map((faq, index) => `
        <div class="faq-item" data-aos="fade-up" data-aos-delay="${index * 70}">
            <button class="faq-question" aria-expanded="false">
                <span class="faq-num">0${index + 1}</span>
                <span class="faq-q-text">${faq.q}</span>
                <i class="fas fa-plus" aria-hidden="true"></i>
            </button>
            <div class="faq-answer" role="region">
                <p>${faq.a}</p>
            </div>
        </div>
    `).join('');

    // Accordion logic — one open at a time
    container.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');

            // Close all
            container.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
            });

            // Toggle clicked
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', renderFAQs);

// ==================== SERVICES PAGE — ALL SERVICES ====================

const allServices = [
    { icon: "fas fa-exclamation-triangle", title: "Emergency Plumbing",          desc: "24/7 rapid response for burst pipes, floods, and urgent plumbing failures.",   slug: "emergency-plumbing"        },
    { icon: "fas fa-bath",                 title: "Drain &amp; Sewer Cleaning",  desc: "Clear stubborn clogs and keep your drains flowing freely.",                    slug: "drain-cleaning"            },
    { icon: "fas fa-tint",                 title: "Leak Detection &amp; Repair", desc: "Fast, accurate leak location and repair before damage spreads.",               slug: "leak-repair"               },
    { icon: "fas fa-tools",                title: "Pipe Repair &amp; Replacement", desc: "Expert repair and full repiping for homes and commercial properties.",        slug: "pipe-repair"               },
    { icon: "fas fa-toilet",               title: "Toilet Installation &amp; Repair", desc: "Installations, repairs, and replacements — done right the first time.",    slug: "toilet-installation"       },
    { icon: "fas fa-faucet",               title: "Faucet &amp; Fixture Repair", desc: "All types of fixture work, from dripping faucets to full replacements.",       slug: "faucet-fixture-repair"     },
    { icon: "fas fa-shower",               title: "Shower &amp; Tub Installation", desc: "Beautiful bathroom upgrades installed cleanly and on schedule.",              slug: "shower-tub-installation"   },
    { icon: "fas fa-fire",                 title: "Water Heater Services",        desc: "Installation, repair, and replacement of tank and tankless water heaters.",    slug: "water-heater-services"     },
    { icon: "fas fa-building",             title: "Commercial Plumbing",          desc: "Comprehensive plumbing for hotels, restaurants, businesses, and multi-units.", slug: "commercial-plumbing"       },
    { icon: "fas fa-wrench",               title: "Garbage Disposal Repair",      desc: "Installation, repair, and replacement of kitchen garbage disposals.",          slug: "garbage-disposal-repair"   },
    { icon: "fas fa-swimming-pool",        title: "Pool Plumbing Repair",         desc: "Pool and spa plumbing — leak detection, pump lines, and water features.",      slug: "pool-plumbing-repair"      },
    { icon: "fas fa-home",                 title: "Bathroom &amp; Kitchen Remodeling", desc: "Full plumbing rough-in and fit-out for any residential remodel.",         slug: "bathroom-kitchen-remodeling"}
];

function renderAllServices() {
    const grid = document.getElementById('services-grid');
    if (!grid) return;

    grid.innerHTML = allServices.map((service, index) => `
        <div class="svc-card" data-aos="fade-up" data-aos-delay="${index * 55}">
            <div class="svc-icon-wrap">
                <i class="${service.icon}"></i>
            </div>
            <div class="svc-card-body">
                <h3>${service.title}</h3>
                <p>${service.desc}</p>
            </div>
            <a href="services/${service.slug}.html" class="svc-link">
                Learn more <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', renderAllServices);

// ==================== CONTACT PAGE ====================

const commonIssues = [
    "Emergency Leak", "No Hot Water", "Clogged Drain", "Burst Pipe",
    "Toilet Not Flushing", "Water Heater Issue", "Low Water Pressure",
    "Garbage Disposal Jam", "Sewer Backup", "Bathroom Remodel",
    "Commercial Job", "Other"
];

function renderIssueOptions() {
    const container = document.getElementById('issue-options');
    if (!container) return;

    container.innerHTML = commonIssues.map(issue => `
        <div class="ct-issue-chip" data-issue="${issue}" role="button" tabindex="0" aria-pressed="false">
            ${issue}
        </div>
    `).join('');

    container.querySelectorAll('.ct-issue-chip').forEach(chip => {
        chip.addEventListener('click', () => toggleChip(chip));
        chip.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleChip(chip);
            }
        });
    });
}

function toggleChip(chip) {
    const pressed = chip.classList.toggle('active');
    chip.setAttribute('aria-pressed', String(pressed));
}

// ---- Form submission ----
function initContactForm() {
    const form     = document.getElementById('contact-form');
    const btn      = document.getElementById('ct-submit');
    const success  = document.getElementById('ct-success');
    const error    = document.getElementById('ct-error');

    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name  = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        if (!name || !phone) {
            highlightEmpty(['name', 'phone']);
            return;
        }

        const selectedIssues = Array.from(
            document.querySelectorAll('.ct-issue-chip.active')
        ).map(el => el.dataset.issue);

        const formData = {
            name,
            phone,
            email:   document.getElementById('email').value.trim(),
            issues:  selectedIssues.join(', '),
            message: document.getElementById('message').value.trim(),
            timestamp: new Date().toISOString()
        };

        setLoading(btn, true);
        success.classList.remove('show');
        error.classList.remove('show');

        const scriptURL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

        try {
            await fetch(scriptURL, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' }
            });

            success.classList.add('show');
            form.reset();
            document.querySelectorAll('.ct-issue-chip.active').forEach(c => {
                c.classList.remove('active');
                c.setAttribute('aria-pressed', 'false');
            });

        } catch (err) {
            error.classList.add('show');
            console.error('Form submission error:', err);

        } finally {
            setLoading(btn, false);
            (success.classList.contains('show') ? success : error)
                .scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

function setLoading(btn, isLoading) {
    btn.classList.toggle('loading', isLoading);
    btn.disabled = isLoading;
}

function highlightEmpty(ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.value.trim()) {
            el.style.borderColor = '#ef4444';
            el.addEventListener('input', () => {
                el.style.borderColor = '';
            }, { once: true });
        }
    });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
    renderIssueOptions();
    initContactForm();
});


// ==================== REVIEWS PAGE ====================

const reviews = [
    {
        text: "They arrived within 30 minutes for a burst pipe emergency. Professional, clean, and fair pricing. Saved my kitchen!",
        name: "Maria Rodriguez",
        location: "South Beach, Miami",
        stars: 5,
        platform: "google",
        date: "2 weeks ago"
    },
    {
        text: "Best plumber I've worked with in Miami Beach. Fixed our water heater the same day and explained everything clearly.",
        name: "David Thompson",
        location: "North Miami Beach",
        stars: 5,
        platform: "google",
        date: "1 month ago"
    },
    {
        text: "Used them for a complete bathroom remodel. Excellent workmanship, great communication, and everything finished on schedule.",
        name: "Elena Vargas",
        location: "Bal Harbour",
        stars: 5,
        platform: "yelp",
        date: "3 weeks ago"
    },
    {
        text: "Called at 2am for a sewer backup. They picked up immediately and had someone here in under an hour. Incredible service.",
        name: "James Mitchell",
        location: "Brickell, Miami",
        stars: 5,
        platform: "google",
        date: "5 days ago"
    },
    {
        text: "Transparent pricing, no hidden fees. They told me exactly what the repair would cost before starting. Refreshing honesty.",
        name: "Sofia Hernandez",
        location: "Surfside, FL",
        stars: 5,
        platform: "yelp",
        date: "2 months ago"
    },
    {
        text: "Had a major leak under the kitchen sink. The technician was knowledgeable and fixed it quickly. Will definitely call again.",
        name: "Robert Chen",
        location: "Downtown Miami",
        stars: 5,
        platform: "google",
        date: "3 months ago"
    },
    {
        text: "They installed a new tankless water heater for us. Professional, efficient, and cleaned up perfectly afterward.",
        name: "Angela Morales",
        location: "Sunny Isles Beach",
        stars: 5,
        platform: "google",
        date: "1 month ago"
    },
    {
        text: "Our restaurant had a major drain issue on a Friday night. They were here in 45 minutes and saved our weekend service.",
        name: "Marco Rossi",
        location: "South Beach, Miami",
        stars: 5,
        platform: "yelp",
        date: "6 weeks ago"
    },
    {
        text: "Replaced all the pipes in our older condo. Fair quote, excellent work, minimal disruption. Highly recommend.",
        name: "Patricia Williams",
        location: "Miami Beach, FL",
        stars: 5,
        platform: "google",
        date: "4 months ago"
    }
];

// How many to show initially and per load-more click
const INITIAL_SHOW = 6;
const LOAD_MORE_COUNT = 3;

let activeFilter = 'all';
let visibleCount = INITIAL_SHOW;

// ---- Helpers ----

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function buildStars(count) {
    return Array(count).fill('<i class="fas fa-star"></i>').join('');
}

function buildCard(review) {
    const platformLabel = review.platform === 'google' ? 'Google' : 'Yelp';
    return `
        <div class="rv-card" data-platform="${review.platform}" data-stars="${review.stars}">
            <span class="rv-card-quote" aria-hidden="true">"</span>
            <div class="rv-card-stars">${buildStars(review.stars)}</div>
            <p class="rv-card-text">${review.text}</p>
            <div class="rv-card-author">
                <div class="rv-avatar">${getInitials(review.name)}</div>
                <div class="rv-author-info">
                    <span class="rv-author-name">${review.name}</span>
                    <span class="rv-author-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${review.location} · ${review.date}
                    </span>
                </div>
                <span class="rv-platform-badge ${review.platform}">
                    <i class="fab fa-${review.platform}"></i>
                    ${platformLabel}
                </span>
            </div>
        </div>
    `;
}

// ---- Render ----

function getFilteredReviews() {
    return reviews.filter(r => {
        if (activeFilter === 'all') return true;
        if (activeFilter === '5') return r.stars === 5;
        return r.platform === activeFilter;
    });
}

function renderGrid() {
    const grid = document.getElementById('rv-grid');
    const loadBtn = document.getElementById('rv-load-more');
    if (!grid) return;

    const filtered = getFilteredReviews();
    const toShow = filtered.slice(0, visibleCount);

    grid.innerHTML = toShow.map(r => buildCard(r)).join('');

    // Show/hide load more button
    if (loadBtn) {
        if (visibleCount >= filtered.length) {
            loadBtn.classList.add('rv-no-more');
        } else {
            loadBtn.classList.remove('rv-no-more');
        }
    }
}

// ---- Filters ----

function initFilters() {
    const filterBtns = document.querySelectorAll('.rv-filter');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            visibleCount = INITIAL_SHOW;
            renderGrid();
        });
    });
}

// ---- Load more ----

function initLoadMore() {
    const btn = document.getElementById('rv-load-more');
    if (!btn) return;

    btn.addEventListener('click', () => {
        visibleCount += LOAD_MORE_COUNT;
        renderGrid();
        // Scroll new cards into view smoothly
        const cards = document.querySelectorAll('.rv-card');
        const firstNew = cards[visibleCount - LOAD_MORE_COUNT];
        if (firstNew) {
            firstNew.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

// ---- Init ----

document.addEventListener('DOMContentLoaded', () => {
    renderGrid();
    initFilters();
    initLoadMore();
});


// ==================== GALLERY PAGE ====================

document.addEventListener('DOMContentLoaded', () => {

    const projects = [
        { img: 'assets/images/hero_img1.webp',       cat: 'emergency',     catLabel: 'Emergency',     title: 'Burst Pipe Emergency Repair',          desc: 'Rapid response repair preventing major water damage in a Miami Beach residence.' },
        { img: 'assets/images/testimonial_img.webp', cat: 'water-heater',  catLabel: 'Water Heater',  title: 'Tankless Water Heater Installation',   desc: 'Modern energy-efficient upgrade completed for a luxury condo in Brickell.' },
        { img: 'assets/images/hero_img1.webp',       cat: 'drain',         catLabel: 'Drain & Sewer', title: 'Commercial Drain Cleaning',             desc: 'Preventative maintenance for a South Beach restaurant with recurring blockages.' },
        { img: 'assets/images/testimonial_img.webp', cat: 'bathroom',      catLabel: 'Bathroom',      title: 'Bathroom Renovation Plumbing',          desc: 'Complete rough-in and fixture installation for a full remodel in Sunny Isles.' },
        { img: 'assets/images/hero_img1.webp',       cat: 'pipe',          catLabel: 'Pipes',         title: 'Full Repipe — Condo Unit',              desc: 'Complete copper repipe for an older Miami Beach condo with corroded galvanized pipes.' },
        { img: 'assets/images/testimonial_img.webp', cat: 'kitchen',       catLabel: 'Kitchen',       title: 'Kitchen Sink & Fixture Upgrade',        desc: 'Modern fixture replacement and supply line upgrade in a Bal Harbour home.' },
        { img: 'assets/images/hero_img1.webp',       cat: 'commercial',    catLabel: 'Commercial',    title: 'Hotel Plumbing Maintenance',            desc: 'Scheduled preventative maintenance across 8 floors of a Miami Beach boutique hotel.' },
        { img: 'assets/images/testimonial_img.webp', cat: 'water-heater',  catLabel: 'Water Heater',  title: 'Water Heater Replacement',              desc: 'Same-day tank replacement for a family in North Miami Beach with no hot water.' },
        { img: 'assets/images/hero_img1.webp',       cat: 'emergency',     catLabel: 'Emergency',     title: 'Sewer Line Emergency',                  desc: 'Emergency sewer line repair after a backup flooded a ground-floor Brickell apartment.' },
        { img: 'assets/images/testimonial_img.webp', cat: 'bathroom',      catLabel: 'Bathroom',      title: 'Shower & Tub Installation',             desc: 'New walk-in shower installation with custom valve and rainfall showerhead.' },
        { img: 'assets/images/hero_img1.webp',       cat: 'drain',         catLabel: 'Drain & Sewer', title: 'Hydro Jetting — Grease Blockage',       desc: 'High-pressure hydro jetting service to clear a severe grease blockage for a Downtown restaurant.' },
        { img: 'assets/images/testimonial_img.webp', cat: 'pipe',          catLabel: 'Pipes',         title: 'Leak Detection & Pipe Repair',          desc: 'Electronic leak detection locating a hidden leak behind drywall with zero demolition.' }
    ];

    const INITIAL_COUNT = 8;
    const LOAD_COUNT = 4;

    let activeFilter = 'all';
    let visibleCount = INITIAL_COUNT;
    let filteredProjects = [];
    let lightboxIndex = 0;

    // ---- Masonry Grid ----
    function getFiltered() {
        return activeFilter === 'all' 
            ? projects 
            : projects.filter(p => p.cat === activeFilter);
    }

    function buildCard(p, idx) {
        return `
            <div class="gl-card" data-idx="${idx}" role="button" tabindex="0" aria-label="View ${p.title}">
                <div class="gl-card-img-wrap">
                    <img src="${p.img}" alt="${p.title}" class="gl-card-img" loading="lazy">
                    <span class="gl-card-cat">${p.catLabel}</span>
                    <span class="gl-card-zoom"><i class="fas fa-expand"></i></span>
                </div>
                <div class="gl-card-body">
                    <h3>${p.title}</h3>
                    <p>${p.desc}</p>
                </div>
            </div>
        `;
    }

    function renderGrid() {
        const grid = document.getElementById('gl-masonry');
        const loadBtn = document.getElementById('gl-load-more');
        if (!grid) return;

        filteredProjects = getFiltered();
        const toShow = filteredProjects.slice(0, visibleCount);

        grid.innerHTML = toShow.map((p, i) => buildCard(p, i)).join('');

        // Card click handlers
        grid.querySelectorAll('.gl-card').forEach((card, i) => {
            card.addEventListener('click', () => openLightbox(i));
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(i);
                }
            });
        });

        if (loadBtn) {
            loadBtn.classList.toggle('gl-no-more', visibleCount >= filteredProjects.length);
        }
    }

    function initFilters() {
        document.querySelectorAll('.gl-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.gl-filter').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeFilter = btn.dataset.filter;
                visibleCount = INITIAL_COUNT;
                renderGrid();
            });
        });
    }

    function initLoadMore() {
        const btn = document.getElementById('gl-load-more');
        if (!btn) return;
        btn.addEventListener('click', () => {
            visibleCount += LOAD_COUNT;
            renderGrid();
        });
    }

    // ---- Lightbox ----
    function openLightbox(idx) {
        lightboxIndex = idx;
        const lb = document.getElementById('gl-lightbox');
        const img = document.getElementById('gl-lb-img');
        const cap = document.getElementById('gl-lb-caption');
        const p = filteredProjects[idx];

        if (!p || !lb || !img) return;

        img.src = p.img;
        img.alt = p.title;
        cap.textContent = `${p.title} — ${p.desc}`;
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        const lb = document.getElementById('gl-lightbox');
        if (lb) lb.classList.remove('open');
        document.body.style.overflow = '';
    }

    function lbNavigate(dir) {
        lightboxIndex = (lightboxIndex + dir + filteredProjects.length) % filteredProjects.length;
        openLightbox(lightboxIndex);
    }

    function initLightbox() {
        document.getElementById('gl-lb-close')?.addEventListener('click', closeLightbox);
        document.getElementById('gl-lb-prev')?.addEventListener('click', () => lbNavigate(-1));
        document.getElementById('gl-lb-next')?.addEventListener('click', () => lbNavigate(1));

        const lightbox = document.getElementById('gl-lightbox');
        if (lightbox) {
            lightbox.addEventListener('click', e => {
                if (e.target.id === 'gl-lightbox') closeLightbox();
            });
        }

        document.addEventListener('keydown', e => {
            const lb = document.getElementById('gl-lightbox');
            if (!lb?.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') lbNavigate(-1);
            if (e.key === 'ArrowRight') lbNavigate(1);
        });
    }

    // ---- Before & After Sliders ----
    function initBASliders() {
        document.querySelectorAll('.gl-ba-slider').forEach(slider => {
            const after = slider.querySelector('.gl-ba-after');
            const handle = slider.querySelector('.gl-ba-handle');
            if (!after || !handle) return;

            let isDragging = false;

            function setPos(clientX) {
                const rect = slider.getBoundingClientRect();
                let pct = ((clientX - rect.left) / rect.width) * 100;
                pct = Math.max(2, Math.min(98, pct));
                after.style.clipPath = `inset(0 0 0 ${pct}%)`;
                handle.style.left = `${pct}%`;
            }

            slider.addEventListener('mousedown', e => { isDragging = true; setPos(e.clientX); });
            window.addEventListener('mousemove', e => { if (isDragging) setPos(e.clientX); });
            window.addEventListener('mouseup', () => { isDragging = false; });

            slider.addEventListener('touchstart', e => { isDragging = true; setPos(e.touches[0].clientX); }, { passive: true });
            window.addEventListener('touchmove', e => { if (isDragging) setPos(e.touches[0].clientX); }, { passive: true });
            window.addEventListener('touchend', () => { isDragging = false; });
        });
    }

    // ---- Stats Counters ----
    function animateCounter(el, target, duration = 1500) {
        let start = null;
        function step(ts) {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
        }
        requestAnimationFrame(step);
    }

    function initStatsCounters() {
        const nums = document.querySelectorAll('.gl-stat-num[data-target]');
        if (!nums.length) return;

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target, parseInt(entry.target.dataset.target, 10));
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        nums.forEach(el => obs.observe(el));
    }

    // ---- FAQ ----
    function initFAQ() {
        document.querySelectorAll('.gl-faq-item').forEach(item => {
            const question = item.querySelector('.gl-faq-q');
            if (!question) return;

            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                // Close all
                document.querySelectorAll('.gl-faq-item').forEach(i => {
                    i.classList.remove('open');
                    i.querySelector('.gl-faq-q')?.setAttribute('aria-expanded', 'false');
                });

                if (!isOpen) {
                    item.classList.add('open');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    // ---- Initialize Everything ----
    renderGrid();
    initFilters();
    initLoadMore();
    initLightbox();
    initBASliders();
    initStatsCounters();
    initFAQ();
});



document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("keydown", e => {
    if (e.ctrlKey && (e.key === "u" || e.key === "U" || e.key === "s" || e.key === "S")) {
        e.preventDefault();
    }
    if (e.keyCode === 123) {
        e.preventDefault();
    }
});