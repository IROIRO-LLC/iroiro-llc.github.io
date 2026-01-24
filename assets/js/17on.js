// 17on Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initTypewriterEffect();
    initStyleTabs();
    initFeedbackForm();
    initMultiSectionNav();
});

// Typewriter Effect for Haiku Demo
function initTypewriterEffect() {
    const haiku = [
        { text: "An old silent pond", syllables: 5 },
        { text: "A frog jumps into the pond", syllables: 7 },
        { text: "Splash! Silence again", syllables: 5 }
    ];

    const lines = document.querySelectorAll('.haiku-line');
    if (lines.length === 0) return;

    let currentLine = 0;
    let currentChar = 0;
    let isDeleting = false;
    let isPaused = false;

    function typeWriter() {
        if (isPaused) {
            setTimeout(typeWriter, 100);
            return;
        }

        const line = lines[currentLine];
        const textElement = line.querySelector('.haiku-text');
        const syllableElement = line.querySelector('.syllable-count');
        const cursorElement = line.querySelector('.cursor');

        if (!textElement) return;

        const fullText = haiku[currentLine].text;
        const syllables = haiku[currentLine].syllables;

        if (!isDeleting) {
            // Typing
            textElement.textContent = fullText.substring(0, currentChar + 1);
            currentChar++;

            // Show cursor on current line
            document.querySelectorAll('.cursor').forEach(c => c.style.display = 'none');
            if (cursorElement) cursorElement.style.display = 'inline-block';

            if (currentChar === fullText.length) {
                // Show syllable count
                if (syllableElement) {
                    syllableElement.textContent = syllables;
                    syllableElement.classList.add('visible');
                }

                // Pause before moving to next line
                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    currentLine++;

                    if (currentLine < haiku.length) {
                        currentChar = 0;
                    } else {
                        // All lines complete, pause then restart
                        setTimeout(() => {
                            isDeleting = true;
                            currentLine = haiku.length - 1;
                        }, 3000);
                    }
                }, 800);
            }
        } else {
            // Deleting (reverse order)
            const line = lines[currentLine];
            const textElement = line.querySelector('.haiku-text');
            const syllableElement = line.querySelector('.syllable-count');
            const cursorElement = line.querySelector('.cursor');

            // Hide syllable count
            if (syllableElement) syllableElement.classList.remove('visible');

            // Show cursor on current line
            document.querySelectorAll('.cursor').forEach(c => c.style.display = 'none');
            if (cursorElement) cursorElement.style.display = 'inline-block';

            const fullText = haiku[currentLine].text;
            currentChar = textElement.textContent.length - 1;
            textElement.textContent = fullText.substring(0, currentChar);

            if (currentChar === 0) {
                textElement.textContent = '';
                currentLine--;

                if (currentLine < 0) {
                    // Reset and start over
                    isDeleting = false;
                    currentLine = 0;
                    currentChar = 0;
                    isPaused = true;
                    setTimeout(() => {
                        isPaused = false;
                    }, 1000);
                }
            }
        }

        // Typing speed
        const speed = isDeleting ? 30 : 60;
        setTimeout(typeWriter, speed);
    }

    // Start the animation after a short delay
    setTimeout(typeWriter, 1500);
}

// Style Tabs Functionality
function initStyleTabs() {
    const tabs = document.querySelectorAll('.style-tab');
    const panels = document.querySelectorAll('.style-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.style;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active panel
            panels.forEach(p => {
                p.classList.remove('active');
                if (p.dataset.style === target) {
                    p.classList.add('active');
                }
            });
        });
    });
}

// Feedback Form Functionality
function initFeedbackForm() {
    const form = document.getElementById('feedback-form');
    if (!form) return;

    const submitBtn = form.querySelector('.submit-btn');
    const messageDiv = form.querySelector('.form-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            type: form.querySelector('#feedback-type').value,
            subject: form.querySelector('#feedback-subject').value,
            description: form.querySelector('#feedback-description').value,
            email: form.querySelector('#feedback-email').value
        };

        // Validate
        if (!formData.type || !formData.subject || !formData.description) {
            showMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const response = await fetch('https://kigo-feedback.iroiro.workers.dev', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: formData.type,
                    title: formData.subject,
                    body: `${formData.description}\n\n---\nSource: 17on Landing Page\nEmail: ${formData.email || 'Not provided'}`
                })
            });

            if (response.ok) {
                showMessage('Thank you for your feedback! We\'ll review it soon.', 'success');
                form.reset();
            } else {
                throw new Error('Server responded with an error');
            }
        } catch (error) {
            console.error('Feedback submission error:', error);
            showMessage('Something went wrong. Please try again later.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Feedback';
        }
    });

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = 'form-message ' + type;

        // Auto-hide success message after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.className = 'form-message';
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }
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

            // For feature cards, add staggered animation
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

// Observe all sections with observe-me class
document.querySelectorAll('.observe-me').forEach(section => {
    observer.observe(section);
});

// Multi-Section Navigation for Landing Page
function initMultiSectionNav() {
    const dots = document.querySelectorAll('.nav-dot');
    if (dots.length <= 2) return; // Use default nav for 2 dots or less

    // Define sections in order
    const sections = [
        { id: 'top', offset: 0 },
        { id: 'features', element: document.getElementById('features') },
        { id: 'styles', element: document.getElementById('styles') },
        { id: 'collectibles', element: document.getElementById('collectibles') },
        { id: 'pricing', element: document.getElementById('pricing') },
        { id: 'feedback', element: document.getElementById('feedback') }
    ];

    // Override click handlers for all dots
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

    // Update active dot on scroll
    const updateActiveDot = () => {
        const scrollPosition = window.pageYOffset + window.innerHeight * 0.3;

        let activeId = 'top';

        // Check each section from bottom to top
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

        // Update active class
        dots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.dataset.target === activeId) {
                dot.classList.add('active');
            }
        });
    };

    // Throttled scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
            updateActiveDot();
            scrollTimeout = null;
        }, 50);
    });

    // Initial update
    updateActiveDot();
}
