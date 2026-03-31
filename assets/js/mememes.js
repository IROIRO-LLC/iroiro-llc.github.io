// MeMemes Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initFormatTicker();
    initBillingToggle();
    initMultiSectionNav();
});

// Format Tag Ticker Animation
function initFormatTicker() {
    const tags = document.querySelectorAll('.format-tag');
    if (tags.length === 0) return;

    let currentIndex = 0;

    function cycleTag() {
        tags.forEach(tag => tag.classList.remove('active'));
        tags[currentIndex].classList.add('active');
        currentIndex = (currentIndex + 1) % tags.length;
    }

    cycleTag();
    setInterval(cycleTag, 1200);
}

// Billing Toggle (Monthly / Annual)
function initBillingToggle() {
    const toggle = document.getElementById('billing-toggle');
    const price = document.getElementById('pro-price');
    const trial = document.getElementById('pro-trial');
    const labels = document.querySelectorAll('.billing-label');
    if (!toggle || !price) return;

    let isAnnual = true;

    function update() {
        toggle.classList.toggle('annual', isAnnual);
        labels.forEach(l => {
            l.classList.toggle('active', l.dataset.plan === (isAnnual ? 'annual' : 'monthly'));
        });
        if (isAnnual) {
            price.innerHTML = '$14.99 <span>/yr</span>';
            if (trial) trial.classList.remove('disabled');
        } else {
            price.innerHTML = '$1.99 <span>/mo</span>';
            if (trial) trial.classList.add('disabled');
        }
    }

    toggle.addEventListener('click', () => { isAnnual = !isAnnual; update(); });
    labels.forEach(l => l.addEventListener('click', () => {
        isAnnual = l.dataset.plan === 'annual';
        update();
    }));

    update();
}

// Extended Intersection Observer for staggered animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');

            if (entry.target.classList.contains('features-grid')) {
                const cards = entry.target.querySelectorAll('.feature-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('is-visible');
                    }, index * 100);
                });
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.observe-me').forEach(section => {
    observer.observe(section);
});

// Multi-Section Navigation for Landing Page
function initMultiSectionNav() {
    const dots = document.querySelectorAll('.nav-dot');
    if (dots.length <= 2) return;

    const sections = [
        { id: 'top', offset: 0 },
        { id: 'features', element: document.getElementById('features') },
        { id: 'themes', element: document.getElementById('themes') },
        { id: 'how-it-works', element: document.getElementById('how-it-works') },
        { id: 'pricing', element: document.getElementById('pricing') }
    ];

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const target = dot.dataset.target;

            if (target === 'top') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const section = document.getElementById(target);
                if (section) {
                    const headerOffset = 80;
                    const elementPosition = section.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        });
    });

    const updateActiveDot = () => {
        const scrollPosition = window.pageYOffset + window.innerHeight * 0.3;
        let activeId = 'top';

        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section.id === 'top') {
                if (scrollPosition < window.innerHeight * 0.5) {
                    activeId = 'top';
                    break;
                }
            } else if (section.element) {
                const rect = section.element.getBoundingClientRect();
                const sectionTop = rect.top + window.pageYOffset;
                if (scrollPosition >= sectionTop) {
                    activeId = section.id;
                    break;
                }
            }
        }

        dots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.dataset.target === activeId) {
                dot.classList.add('active');
            }
        });
    };

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
            updateActiveDot();
            scrollTimeout = null;
        }, 50);
    });

    updateActiveDot();
}
