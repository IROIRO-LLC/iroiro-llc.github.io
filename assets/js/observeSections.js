// assets/js/observeSections.js - Example (Ensure it targets your sections)
document.addEventListener("DOMContentLoaded", function() {
    // Target the sections that need animation when scrolled into view
    const sections = document.querySelectorAll('.hero-content-section, #brands');

    if (!('IntersectionObserver' in window)) {
        console.log("Intersection Observer not supported, animations disabled.");
        // Optionally add a fallback class to make them visible immediately
        sections.forEach(section => section.classList.add('is-visible'));
        return;
    }

    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before fully in view
        threshold: 0.1 // Trigger when 10% is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: stop observing after first time for performance
                observer.unobserve(entry.target);
            }
            // No 'else' needed if we only want fade-in once
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Note: The brand item staggering is handled purely by CSS delays
    // triggered when the parent (#brands) gets the 'is-visible' class.
});